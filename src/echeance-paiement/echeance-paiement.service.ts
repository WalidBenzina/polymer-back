import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EcheancePaiement } from './echeance-paiement.entity'
import { Commande } from 'src/commande/commande.entity'
import { CreateEcheancePaiementDto } from './dto/create-echeance-paiement.dto'
import { UpdateEcheancePaiementDto } from './dto/update-echeance-paiement.dto'
import { PaiementStatus } from 'src/enums/paiement-status.enum'

@Injectable()
export class EcheancePaiementService {
  constructor(
    @InjectRepository(EcheancePaiement)
    private echeancePaiementRepository: Repository<EcheancePaiement>,
    @InjectRepository(Commande)
    private commandeRepository: Repository<Commande>
  ) {}

  async findAll(): Promise<EcheancePaiement[]> {
    return this.echeancePaiementRepository.find({
      relations: ['commande'],
    })
  }

  async findByCommande(commandeId: string): Promise<EcheancePaiement[]> {
    return this.echeancePaiementRepository.find({
      where: { commande: { idCommande: commandeId } },
      relations: ['commande'],
    })
  }

  async findOne(id: string): Promise<EcheancePaiement> {
    const echeance = await this.echeancePaiementRepository.findOne({
      where: { idEcheance: id },
      relations: ['commande'],
    })

    if (!echeance) {
      throw new NotFoundException(`Échéance de paiement avec ID ${id} non trouvée`)
    }

    return echeance
  }

  async create(createEcheancePaiementDto: CreateEcheancePaiementDto): Promise<EcheancePaiement> {
    const {
      commande: commandeId,
      dateEcheance,
      montant,
      statut,
      description,
    } = createEcheancePaiementDto

    const commande = await this.commandeRepository.findOne({
      where: { idCommande: commandeId },
    })

    if (!commande) {
      throw new NotFoundException(`Commande avec ID ${commandeId} non trouvée`)
    }

    const echeance = this.echeancePaiementRepository.create({
      dateEcheance: new Date(dateEcheance),
      montant,
      statut: statut || PaiementStatus.PENDING,
      description,
      commande,
    })

    return this.echeancePaiementRepository.save(echeance)
  }

  async update(
    id: string,
    updateEcheancePaiementDto: UpdateEcheancePaiementDto
  ): Promise<EcheancePaiement> {
    const echeance = await this.findOne(id)

    if (updateEcheancePaiementDto.dateEcheance) {
      echeance.dateEcheance = new Date(updateEcheancePaiementDto.dateEcheance)
    }

    if (updateEcheancePaiementDto.montant !== undefined) {
      echeance.montant = updateEcheancePaiementDto.montant
    }

    if (updateEcheancePaiementDto.statut) {
      echeance.statut = updateEcheancePaiementDto.statut
    }

    if (updateEcheancePaiementDto.description !== undefined) {
      echeance.description = updateEcheancePaiementDto.description
    }

    if (updateEcheancePaiementDto.commande) {
      const commande = await this.commandeRepository.findOne({
        where: { idCommande: updateEcheancePaiementDto.commande },
      })

      if (!commande) {
        throw new NotFoundException(
          `Commande avec ID ${updateEcheancePaiementDto.commande} non trouvée`
        )
      }

      echeance.commande = commande
    }

    return this.echeancePaiementRepository.save(echeance)
  }

  async remove(id: string): Promise<void> {
    const echeance = await this.findOne(id)
    await this.echeancePaiementRepository.remove(echeance)
  }
}
