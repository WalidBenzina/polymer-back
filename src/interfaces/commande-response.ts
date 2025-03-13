import { CommandeStatus } from 'src/enums/commande-status.enum'
import { LineItem } from '../_models/lineitem.model'
import { Document } from '../document/document.entity'
import { Paiement } from '../paiement/paiement.entity'

export interface CommandeResponse {
  idCommande: string
  dateCommande: string | Date
  client?: {
    idClient: string
    nomClient: string
    email: string
    telephone: string
    adresse: string
  }
  utilisateur: {
    idUtilisateur: string
    nomUtilisateur: string
    email: string
  }
  statut: CommandeStatus
  createdAt: Date
  updatedAt?: Date
  dateLivraisonPrevue: string
  dateLivraisonReelle: string
  refCommande: string
  lineItems?: LineItem[]
  paiements?: Paiement[]
  documents?: Document[]
  totalHt: number
  totalTaxe: number
  totalTtc: number
}
