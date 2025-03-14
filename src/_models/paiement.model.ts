import { MethodPaiement } from 'src/enums/method-paiement.enum'
import { CommandeModel } from './commande.model'
import { UserModel } from './user.model'
import { PaiementStatus } from 'src/enums/paiement-status.enum'

export interface PaiementModel {
  idPaiement: string
  montant: number
  methodePaiement: MethodPaiement
  statut: PaiementStatus
  idCommande: CommandeModel
  idUtilisateur: UserModel
  createdAt: Date
  updatedAt: Date
}
