import { LineItemStatus } from 'src/enums/line-item-status.enum'
import { ProductModel } from './product.model'

export interface LineItem {
  idLineItem: number
  productId: string
  product: ProductModel
  productName: string
  quantity: number
  totalHt: number
  totalTax: number
  totalTtc: number
  statut: LineItemStatus.ACTIVE
  createdAt: Date
  updatedAt: Date
}
