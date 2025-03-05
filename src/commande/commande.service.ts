import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Commande } from './commande.entity'
import { HttpStatus, HttpException } from '@nestjs/common'
import { CreateCommandeDto } from './dto/create-commande.dto'
import { UpdateCommandeDto } from './dto/update-commande.dto'
import { PaginationDto } from 'src/pagination/pagination.dto'
import { Client } from 'src/client/client.entity'
import { User } from 'src/user/user.entity'
import { CommandeStatus } from 'src/enums/commande-status.enum'
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { Product } from 'src/product/product.entity'
import { SeuilProduitService } from 'src/produit_seuils/produit_seuils.service'

import { DocumentsService } from '../document/document.service'
import { CommandeResponse } from '../interfaces/commande-response'
import { Paiement } from 'src/paiement/paiement.entity'
import { PaiementStatus } from 'src/enums/paiement-status.enum'
import { MethodPaiement } from 'src/enums/method-paiement.enum'
import { LineItem } from '../lineitem/lineitem.entity'
import { LineItemService } from '../lineitem/lineitem.service'
import { LineItem as LineItemModel } from 'src/_models/lineitem.model'
import { LineItemStatus } from '../enums/line-item-status.enum'

@Injectable()
export class CommandeService {
  constructor(
    @InjectRepository(Commande)
    private readonly commandeRepository: Repository<Commande>,
    @InjectRepository(Product)
    private readonly produitRepository: Repository<Product>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Paiement)
    private readonly paiementRepository: Repository<Paiement>,
    private readonly seuilService: SeuilProduitService,
    private readonly documentService: DocumentsService,
    @InjectRepository(LineItem)
    private readonly lineItemRepository: Repository<LineItem>,
    private readonly lineItemService: LineItemService
  ) {}

  async create(createCommandeDto: CreateCommandeDto): Promise<CommandeResponse> {
    const {
      client,
      utilisateur,
      dateCommande,
      statut,
      dateLivraisonPrevue,
      dateLivraisonReelle,
      refCommande = `CMD-${Date.now()}`,
      ligneItems = [],
      totalHt = 0,
      totalTaxe = 0,
      totalTtc = 0,
      methodePaiement,
    } = createCommandeDto

    const queryRunner = this.commandeRepository.manager.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const clientEntity = client
        ? await this.clientRepository.findOne({ where: { idClient: client } })
        : null
      const utilisateurEntity = await this.userRepository.findOne({
        where: { idUtilisateur: utilisateur },
        relations: ['role'],
      })

      if (client && !clientEntity) {
        throw new NotFoundException(`Client avec ID ${client} non trouvé`)
      }
      if (!utilisateurEntity) {
        throw new NotFoundException(`Utilisateur avec ID ${utilisateur} non trouvé`)
      }

      // Stock verification
      for (const item of ligneItems) {
        const produit = await this.produitRepository.findOne({
          where: { idProduit: item.produit.idProduit },
        })

        if (!produit) {
          throw new NotFoundException(`Produit avec ID ${item.produit.idProduit} non trouvé`)
        }

        await this.seuilService.checkStock(produit, item.quantite)
        await this.seuilService.updateStock(produit, item.quantite)
        await queryRunner.manager.save(produit)
      }

      // Create commande without line items first
      const commandeEntity = this.commandeRepository.create({
        dateCommande: new Date(dateCommande),
        statut: statut as CommandeStatus,
        client: clientEntity,
        utilisateur: utilisateurEntity,
        refCommande,
        dateLivraisonPrevue,
        dateLivraisonReelle,
        totalHt,
        totalTaxe,
        totalTtc,
      })

      const savedCommande = await queryRunner.manager.save(commandeEntity)

      // Create line items directly with queryRunner
      for (const item of ligneItems) {
        const produit = await this.produitRepository.findOne({
          where: { idProduit: item.produit.idProduit },
        })

        if (!produit) {
          throw new NotFoundException(`Produit avec ID ${item.produit.idProduit} non trouvé`)
        }

        // Create the line item directly with queryRunner instead of using the service
        const lineItem = this.lineItemRepository.create({
          produit,
          commande: savedCommande,
          quantite: item.quantite,
          totalHt: item.totalHt,
          totalTax: item.totalTax,
          totalTtc: item.totalTtc,
          statut: item.statut ? LineItemStatus[item.statut.toUpperCase()] : LineItemStatus.ACTIVE,
        })

        await queryRunner.manager.save(lineItem)
      }

      // Create payment
      const paiementEntity = this.paiementRepository.create({
        montant: totalTtc,
        methodePaiement: methodePaiement || MethodPaiement.VIREMENT,
        statut: PaiementStatus.PENDING,
        idCommande: savedCommande,
        idUtilisateur: utilisateurEntity,
      })

      const savedPaiement = await queryRunner.manager.save(paiementEntity)

      // Ensure the payment is associated with the order
      if (!savedCommande.paiements) {
        savedCommande.paiements = []
      }
      savedCommande.paiements.push(savedPaiement)
      await queryRunner.manager.save(savedCommande)

      await queryRunner.commitTransaction()

      // Fetch the complete commande with relations for the response
      const completeCommande = await this.commandeRepository.findOne({
        where: { idCommande: savedCommande.idCommande },
        relations: [
          'client',
          'utilisateur',
          'lineItems',
          'lineItems.produit',
          'paiements',
          'documents',
        ],
      })

      return this.toCommandeModel(completeCommande)
    } catch (error) {
      await queryRunner.rollbackTransaction()
      console.error('Erreur lors de la création de la commande:', error)
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la création de la commande'
      )
    } finally {
      await queryRunner.release()
    }
  }

  async updateCommandeStatus(id: string, statut: CommandeStatus): Promise<CommandeResponse> {
    const queryRunner = this.commandeRepository.manager.connection.createQueryRunner()
    await queryRunner.startTransaction()

    try {
      const commande = await queryRunner.manager.findOne(Commande, {
        where: { idCommande: id },
        relations: ['client', 'utilisateur'],
      })

      if (!commande) {
        throw new NotFoundException(`Commande avec ID ${id} non trouvée`)
      }

      //❗ Vérification des statuts non annulables
      if (this.isNonCancelableStatus(commande.statut)) {
        throw new HttpException(
          "Impossible d'annuler cette commande, elle est déjà expédiée ou livrée",
          HttpStatus.BAD_REQUEST
        )
      }

      //❗ Libération du stock si la commande est annulée
      if (statut === CommandeStatus.CANCELLED) {
        for (const item of commande.lineItems) {
          const produit = await queryRunner.manager.findOne(Product, {
            where: { idProduit: item.produit.idProduit },
          })

          if (produit) {
            // ❗Libération du stock via le service des seuils
            this.seuilService.releaseStock(produit, item.quantite)

            await queryRunner.manager.save(produit)
          }
        }
      }

      //❗ Mise à jour du stock et du nombre vendu si la commande est confirmée
      if (statut === CommandeStatus.CONFIRMED) {
        for (const item of commande.lineItems) {
          const produit = await queryRunner.manager.findOne(Product, {
            where: { idProduit: item.produit.idProduit },
          })

          if (produit) {
            produit.nombreVendu += item.quantite //❗ Augmentation du nombre vendu
            await queryRunner.manager.save(produit) //❗ Sauvegarde du produit avec la mise à jour du stock et du nombre vendu
          }
        }
      }

      //❗ Mise à jour du statut de la commande
      commande.statut = statut
      await queryRunner.manager.save(commande)

      await queryRunner.commitTransaction()

      return this.toCommandeModel(commande)
    } catch (error) {
      await queryRunner.rollbackTransaction()
      console.error('Erreur lors de la mise à jour du statut de la commande:', error)
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la mise à jour du statut de la commande'
      )
    } finally {
      await queryRunner.release()
    }
  }

  //❗ Fonction pour vérifier si un statut est dans les statuts non annulables
  private isNonCancelableStatus(statut: CommandeStatus): boolean {
    const nonCancelableStatuses = [
      CommandeStatus.SHIPPED,
      CommandeStatus.DELIVERED,
      CommandeStatus.CANCELLED,
    ]
    return nonCancelableStatuses.includes(statut)
  }

  private toCommandeModel(commande: Commande): CommandeResponse {
    // Convert lineItems to ligneItems for the response model format
    const ligneItems =
      commande.lineItems?.map((item) => ({
        idLineItem: item.idLineItem,
        produit: item.produit,
        quantite: item.quantite,
        totalHt: item.totalHt,
        totalTax: item.totalTax,
        totalTtc: item.totalTtc,
        statut: item.statut,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })) || []

    // Create the response object with the correct types
    const response: CommandeResponse = {
      idCommande: commande.idCommande,
      dateCommande: commande.dateCommande,
      client: commande.client
        ? {
            idClient: commande.client.idClient,
            nomClient: commande.client.nomClient,
            email: commande.client.email,
            telephone: commande.client.telephone,
            adresse: commande.client.adresse,
          }
        : null,
      utilisateur: {
        idUtilisateur: commande.utilisateur.idUtilisateur,
        nomUtilisateur: commande.utilisateur.nomUtilisateur,
        email: commande.utilisateur.email,
      },
      statut: commande.statut,
      createdAt: commande.createdAt,
      updatedAt: commande.updatedAt,
      dateLivraisonPrevue: commande.dateLivraisonPrevue,
      dateLivraisonReelle: commande.dateLivraisonReelle,
      refCommande: commande.refCommande,
      // Use type assertion to match the expected response format
      ligneItems: ligneItems as unknown as LineItemModel[],
      // Include payments if available
      paiements: commande.paiements || [],
      // Include documents if available
      documents: commande.documents || [],
      totalHt: commande.totalHt,
      totalTaxe: commande.totalTaxe,
      totalTtc: commande.totalTtc,
    }

    return response
  }

  async findAll(paginationDto: PaginationDto): Promise<{ data; total: number }> {
    const { page, limit } = paginationDto

    const [result, total] = await this.commandeRepository.findAndCount({
      relations: [
        'client',
        'utilisateur.role',
        'paiements',
        'lineItems',
        'lineItems.produit',
        'documents',
      ],
      skip: (page - 1) * limit,
      take: limit,
    })

    return {
      data: result.map((commande) => this.toCommandeModel(commande)),
      total: total,
    }
  }

  async findOne(id: string): Promise<CommandeResponse> {
    const commande = await this.commandeRepository.findOneOrFail({
      where: { idCommande: id },
      relations: [
        'client',
        'utilisateur.role',
        'documents',
        'paiements',
        'lineItems',
        'lineItems.produit',
      ],
    })
    return this.toCommandeModel(commande)
  }

  async update(id: string, updateCommandeDto: UpdateCommandeDto): Promise<CommandeResponse> {
    try {
      const existingCommande = await this.commandeRepository.findOne({
        where: { idCommande: id },
        relations: ['client', 'utilisateur', 'lineItems', 'paiements'],
      })

      if (!existingCommande) {
        throw new NotFoundException(`Commande avec ID ${id} non trouvée`)
      }

      // Update simple fields
      if (updateCommandeDto.dateCommande) {
        existingCommande.dateCommande = new Date(updateCommandeDto.dateCommande)
      }

      if (updateCommandeDto.statut) {
        existingCommande.statut = updateCommandeDto.statut
      }

      if (updateCommandeDto.dateLivraisonPrevue) {
        existingCommande.dateLivraisonPrevue = updateCommandeDto.dateLivraisonPrevue
      }

      if (updateCommandeDto.dateLivraisonReelle) {
        existingCommande.dateLivraisonReelle = updateCommandeDto.dateLivraisonReelle
      }

      if (updateCommandeDto.refCommande) {
        existingCommande.refCommande = updateCommandeDto.refCommande
      }

      if (updateCommandeDto.totalHt !== undefined) {
        existingCommande.totalHt = updateCommandeDto.totalHt
      }

      if (updateCommandeDto.totalTaxe !== undefined) {
        existingCommande.totalTaxe = updateCommandeDto.totalTaxe
      }

      if (updateCommandeDto.totalTtc !== undefined) {
        existingCommande.totalTtc = updateCommandeDto.totalTtc
      }

      if (updateCommandeDto.client) {
        const clientEntity = await this.clientRepository.findOne({
          where: { idClient: updateCommandeDto.client },
        })
        if (!clientEntity) {
          throw new NotFoundException(`Client avec ID ${updateCommandeDto.client} non trouvé`)
        }
        existingCommande.client = clientEntity
      }

      if (updateCommandeDto.utilisateur) {
        const utilisateurEntity = await this.userRepository.findOne({
          where: { idUtilisateur: updateCommandeDto.utilisateur },
        })
        if (!utilisateurEntity) {
          throw new NotFoundException(
            `Utilisateur avec ID ${updateCommandeDto.utilisateur} non trouvé`
          )
        }
        existingCommande.utilisateur = utilisateurEntity
      }

      // Handle line items update
      if (updateCommandeDto.ligneItems) {
        // Delete existing line items
        const existingLineItems = await this.lineItemRepository.find({
          where: { commande: { idCommande: id } },
        })

        if (existingLineItems.length > 0) {
          await this.lineItemRepository.remove(existingLineItems)
        }

        // Create new line items using the service
        for (const item of updateCommandeDto.ligneItems) {
          await this.lineItemService.createLineItem(item, id)
        }
      }

      // Save the commande without line items (they're saved separately)
      await this.commandeRepository.save(existingCommande)

      // Fetch the updated commande with all relations
      const completeCommande = await this.commandeRepository.findOne({
        where: { idCommande: id },
        relations: ['client', 'utilisateur', 'lineItems', 'lineItems.produit', 'paiements'],
      })

      return this.toCommandeModel(completeCommande)
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la mise à jour de la commande. ' + error.message,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const commande = await this.commandeRepository.findOne({
        where: { idCommande: id },
        relations: ['paiements'],
      })

      if (!commande) {
        throw new HttpException('Commande non trouvée.', HttpStatus.NOT_FOUND)
      }

      // Delete associated payments if they exist
      if (commande.paiements && commande.paiements.length > 0) {
        await this.paiementRepository.remove(commande.paiements)
      }

      const result = await this.commandeRepository.delete(id)

      if (result.affected === 0) {
        throw new HttpException(
          'Échec de la suppression de la commande.',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }

      return `Commande avec l'ID ${id} supprimée avec succès.`
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(
        'Erreur inattendue lors de la suppression de la commande.',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
