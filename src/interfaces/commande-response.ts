import { CommandeStatus } from 'src/enums/commande-status.enum'
import { LineItem } from 'src/_models/lineitem.model'
import { RemiseType } from 'src/enums/remise-type.enum'
import { DevisStatus } from 'src/enums/devis-status.enum'
import { EcheancePaiement } from 'src/echeance-paiement/echeance-paiement.entity'
import { Paiement } from 'src/paiement/paiement.entity'
import { Document } from 'src/document/document.entity'
export interface CommandeResponse {
  idCommande: string
  dateCommande: Date
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
  lineItems: LineItem[]
  paiements: Paiement[]
  documents: Document[]
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

  // Échéances de paiement
  echeancesPaiement?: EcheancePaiement[]
}
