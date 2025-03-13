import ProductStatus from 'src/enums/product-status.enum'
import StockStatus from 'src/enums/stock-status.enum'
import { ProductFamilyModel } from './product-family.model'

export interface ProductModel {
  idProduit: string
  nomProduit: string
  description: string
  prix: number // Prix de vente par kg
  prixAchat: number // Prix d'achat par kg
  quantiteDisponible: number
  statutStock: StockStatus
  statut: ProductStatus
  sku: string
  urlImage: string
  evaluation: number
  nombreVendu: number
  tauxTVA: number
  taxeActivee: boolean
  isArchived: boolean
  createdAt: Date
  updatedAt?: Date
  idFamille: string
  famille?: ProductFamilyModel
}
