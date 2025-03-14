import { CommandeStatus } from 'src/enums/commande-status.enum'
import { ClientModel } from './client.model'
import { UserModel } from './user.model'
import { LineItem } from 'src/_models/lineitem.model'
import { DocumentModel } from './document.model'
import { PaiementModel } from './paiement.model'
import { RemiseType } from 'src/enums/remise-type.enum'
import { DevisStatus } from 'src/enums/devis-status.enum'

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

  // Nouveaux champs pour les coûts additionnels
  prixLivraison?: number
  prixEmmagasinage?: number

  // Champs pour les remises
  remiseType?: RemiseType
  remiseValeur?: number

  // Statut du devis (pour validation par le client)
  devisStatus?: DevisStatus

  // Prix final après ajout des coûts et remises
  prixFinal?: number
}
