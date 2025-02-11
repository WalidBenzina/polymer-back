import { LineItemStatus } from 'src/enums/line-item-status.enum'
import { ProductModel } from './product.model'

export interface LineItem {
  idLineItem: number
  produit: ProductModel
  quantite: number
  totalHt: number
  totalTax: number
  totalTtc: number
  statut: LineItemStatus.ACTIVE
  createdAt: Date
  updatedAt: Date
}
