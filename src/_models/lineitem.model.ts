import { LineItemStatus } from 'src/enums/line-item-status.enum'
import { ProductModel } from './product.model'
import SalesUnit from 'src/enums/sales-unit.enum'

export interface LineItem {
  idLineItem: number
  produit: ProductModel
  quantite: number
  uniteVente: SalesUnit
  poidsTotal: number // Poids total en kg pour cette ligne
  prixUnitaire: number // Prix unitaire par kg
  totalHt: number
  totalTax: number
  totalTtc: number
  statut: LineItemStatus.ACTIVE
  createdAt: Date
  updatedAt: Date
}
