import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Paiement } from './paiement.entity'
import { Commande } from 'src/commande/commande.entity'
import { User } from 'src/user/user.entity'
import { CreatePaiementDto } from './dto/create-paiement.dto'
import { UpdatePaiementDto } from './dto/update-paiement.dto'

@Injectable()
export class PaiementService {
  constructor(
    @InjectRepository(Paiement)
    private paiementRepository: Repository<Paiement>,

    @InjectRepository(Commande)
    private commandeRepository: Repository<Commande>,

    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async getAllPaiements(): Promise<Paiement[]> {
    return this.paiementRepository.find()
  }

  async getPaiementById(id: string): Promise<Paiement> {
    const paiement = await this.paiementRepository.findOne({ where: { idPaiement: id } })
    if (!paiement) {
      throw new NotFoundException(`Paiement avec l'ID ${id} non trouvé`)
    }
    return paiement
  }

  async addPaiement(createPaiementDto: CreatePaiementDto): Promise<Paiement> {
    const { montant, methodePaiement, statut, idCommande, idUtilisateur } = createPaiementDto

    // Use a transaction to ensure atomicity
    const queryRunner = this.commandeRepository.manager.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // Fetch the commande with relations to ensure it's fully loaded
      const commande = await queryRunner.manager.findOne(Commande, {
        where: { idCommande },
        relations: ['paiements'],
      })

      if (!commande) {
        throw new NotFoundException(`Commande avec l'ID ${idCommande} non trouvée`)
      }

      const utilisateur = await queryRunner.manager.findOne(User, {
        where: { idUtilisateur },
      })

      if (!utilisateur) {
        throw new NotFoundException(`Utilisateur avec l'ID ${idUtilisateur} non trouvé`)
      }

      // Create the payment entity with explicit references
      const paiement = queryRunner.manager.create(Paiement, {
        montant,
        methodePaiement,
        statut,
        idCommande: commande, // Make sure this is the full commande entity
        idUtilisateur: utilisateur,
      })

      // Save the payment first
      const savedPaiement = await queryRunner.manager.save(paiement)

      // Update the commande to include this payment
      if (!commande.paiements) {
        commande.paiements = []
      }
      commande.paiements.push(savedPaiement)
      await queryRunner.manager.save(commande)

      // Commit the transaction
      await queryRunner.commitTransaction()

      return savedPaiement
    } catch (error) {
      // Rollback the transaction in case of error
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      // Release the query runner
      await queryRunner.release()
    }
  }

  async modifyPaiement(
    idPaiement: string,
    updatePaiementDto: UpdatePaiementDto
  ): Promise<Paiement> {
    const { montant, methodePaiement, statut, idCommande } = updatePaiementDto

    // Use a transaction to ensure atomicity
    const queryRunner = this.commandeRepository.manager.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const paiement = await queryRunner.manager.findOne(Paiement, {
        where: { idPaiement },
        relations: ['idUtilisateur', 'idCommande'],
      })

      if (!paiement) {
        throw new NotFoundException(`Paiement avec l'ID ${idPaiement} non trouvé`)
      }

      const commande = await queryRunner.manager.findOne(Commande, {
        where: { idCommande },
        relations: ['paiements'],
      })

      if (!commande) {
        throw new NotFoundException(`Commande avec l'ID ${idCommande} non trouvée`)
      }

      // If the payment is being assigned to a different order
      if (paiement.idCommande && paiement.idCommande.idCommande !== idCommande) {
        // Get the old order to remove this payment from its list
        const oldCommande = await queryRunner.manager.findOne(Commande, {
          where: { idCommande: paiement.idCommande.idCommande },
          relations: ['paiements'],
        })

        if (oldCommande && oldCommande.paiements) {
          oldCommande.paiements = oldCommande.paiements.filter((p) => p.idPaiement !== idPaiement)
          await queryRunner.manager.save(oldCommande)
        }
      }

      paiement.montant = montant
      paiement.methodePaiement = methodePaiement
      paiement.statut = statut
      paiement.idCommande = commande

      const updatedPaiement = await queryRunner.manager.save(paiement)

      // Ensure the payment is in the order's payments array
      if (!commande.paiements) {
        commande.paiements = []
      }

      // Check if payment is already in the array
      const paymentExists = commande.paiements.some((p) => p.idPaiement === idPaiement)

      if (!paymentExists) {
        commande.paiements.push(updatedPaiement)
        await queryRunner.manager.save(commande)
      }

      // Commit the transaction
      await queryRunner.commitTransaction()

      return updatedPaiement
    } catch (error) {
      // Rollback the transaction in case of error
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      // Release the query runner
      await queryRunner.release()
    }
  }

  async deletePaiement(idPaiement: string): Promise<string> {
    // Use a transaction to ensure atomicity
    const queryRunner = this.commandeRepository.manager.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const paiement = await queryRunner.manager.findOne(Paiement, {
        where: { idPaiement },
        relations: ['idCommande'],
      })

      if (!paiement) {
        throw new NotFoundException(`Paiement avec l'ID ${idPaiement} non trouvé`)
      }

      // If the payment is associated with an order, remove it from the order's payments array
      if (paiement.idCommande) {
        const commande = await queryRunner.manager.findOne(Commande, {
          where: { idCommande: paiement.idCommande.idCommande },
          relations: ['paiements'],
        })

        if (commande && commande.paiements) {
          commande.paiements = commande.paiements.filter((p) => p.idPaiement !== idPaiement)
          await queryRunner.manager.save(commande)
        }
      }

      await queryRunner.manager.remove(paiement)

      // Commit the transaction
      await queryRunner.commitTransaction()

      return `Le paiement avec l'ID ${idPaiement} a été supprimé avec succès`
    } catch (error) {
      // Rollback the transaction in case of error
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      // Release the query runner
      await queryRunner.release()
    }
  }
}
