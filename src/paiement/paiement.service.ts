import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Paiement } from 'src/paiement/paiement.entity'
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

    const commande = await this.commandeRepository.findOne({
      where: { idCommande },
    })
    if (!commande) {
      throw new NotFoundException(`Commande avec l'ID ${idCommande} non trouvée`)
    }

    const utilisateur = await this.userRepository.findOne({
      where: { idUtilisateur: idUtilisateur },
    })
    if (!utilisateur) {
      throw new NotFoundException(`Utilisateur avec l'ID ${idUtilisateur} non trouvé`)
    }

    const paiement = this.paiementRepository.create({
      montant,
      methodePaiement,
      statut,
      idCommande: commande,
      idUtilisateur: utilisateur,
    })

    const savedPaiement = await this.paiementRepository.save(paiement)
    return savedPaiement
  }

  async modifyPaiement(
    idPaiement: string,
    updatePaiementDto: UpdatePaiementDto
  ): Promise<Paiement> {
    const { montant, methodePaiement, statut, idCommande } = updatePaiementDto

    const paiement = await this.paiementRepository.findOne({
      where: { idPaiement },
      relations: ['idUtilisateur'],
    })
    if (!paiement) {
      throw new NotFoundException(`Paiement avec l'ID ${idPaiement} non trouvé`)
    }

    const commande = await this.commandeRepository.findOne({
      where: { idCommande },
    })

    if (!commande) {
      throw new NotFoundException(`Commande avec l'ID ${idCommande} non trouvée`)
    }

    paiement.montant = montant
    paiement.methodePaiement = methodePaiement
    paiement.statut = statut
    paiement.idCommande = commande

    const updatedPaiement = await this.paiementRepository.save(paiement)
    return updatedPaiement
  }

  async deletePaiement(idPaiement: string): Promise<string> {
    const paiement = await this.paiementRepository.findOne({
      where: { idPaiement },
    })
    if (!paiement) {
      throw new NotFoundException(`Paiement avec l'ID ${idPaiement} non trouvé`)
    }

    await this.paiementRepository.remove(paiement)
    return `Le paiement avec l'ID ${idPaiement} a été supprimé avec succès`
  }
}
