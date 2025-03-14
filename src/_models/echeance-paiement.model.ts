import { PaiementStatus } from 'src/enums/paiement-status.enum'
import { CommandeModel } from './commande.model'

export interface EcheancePaiementModel {
  idEcheance: string
  dateEcheance: Date
  montant: number
  statut: PaiementStatus
  commande: CommandeModel
  description?: string
  createdAt: Date
  updatedAt?: Date
}
