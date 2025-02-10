import { LigneCommandeStatus } from 'src/enums/ligne_commande-status.enum'
import { CommandeModel } from './commande.model'
import { ProductModel } from './product.model'

export interface ligneCommandeModel {
  idLigneCommande: number
  commande: CommandeModel
  produit: ProductModel
  statut: LigneCommandeStatus
  quantite: number
  createdAt: Date
  updatedAt: Date
}
