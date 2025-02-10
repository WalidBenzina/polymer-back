import { CommandeStatus } from 'src/enums/commande-status.enum'
import { ClientModel } from './client.model'
import { UserModel } from './user.model'
import { LineItem } from 'src/_models/lineitem.model'
import { DocumentModel } from './document.model'
import { PaiementModel } from './paiement.model'

export interface CommandeModel {
  idCommande: number
  dateCommande: string
  client?: ClientModel
  utilisateur: UserModel
  statut: CommandeStatus
  createdAt: Date
  updatedAt?: Date
  dateLivraisonPrevue: string
  dateLivraisonReelle: string
  refCommande: string
  ligneItems?: LineItem[]
  paiements?: PaiementModel[]
  documents?: DocumentModel[]
  totalHt: number
  totalTaxe: number
  totalTtc: number
}
