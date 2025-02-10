import { CommandeStatus } from 'src/enums/commande-status.enum'
import { LineItem } from '../_models/lineitem.model'
import { Document } from '../document/document.entity'
import { Paiement } from '../paiement/paiement.entity'

export interface CommandeResponse {
  idCommande: string
  dateCommande: Date
  statut: CommandeStatus
  refCommande: string
  dateLivraisonPrevue?: string
  dateLivraisonReelle?: string
  totalHt: number
  totalTaxe: number
  totalTtc: number
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
  ligneItems: LineItem[]
  documents: Document[]
  paiements: Paiement[]
}
