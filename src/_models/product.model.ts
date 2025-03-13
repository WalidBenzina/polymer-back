import ProductStatus from 'src/enums/product-status.enum'
import StockStatus from 'src/enums/stock-status.enum'
import { ProductFamilyModel } from './product-family.model'

export interface ProductModel {
  idProduit: string
  nomProduit: string
  description: string
  prix: number
  prixPalette: number
  prixContainer: number
  quantiteDisponible: number
  statusStock: StockStatus
  statut: ProductStatus
  sku: string
  poids: number
  urlImage: string
  evaluation: number
  nombreVendu: number
  prixVente: number
  prixAchat?: number
  tauxTVA: number
  taxeActivee: boolean
  hauteur?: number
  largeur?: number
  longueur?: number
  isArchived: boolean
  createdAt: Date
  updatedAt?: Date
  idFamille: string
  famille?: ProductFamilyModel
}
