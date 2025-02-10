import { factureModel } from './facture.model'
import { ProductModel } from './product.model'

export interface ligneFactureModel {
  idLigneFacture: number
  facture: factureModel
  produit: ProductModel
  quantite: number
  prixUnitaire: number
  createdAt: Date
  updatedAt: Date
}
