import { ProductModel } from './product.model'

export interface ProductFamilyModel {
  idFamille: string
  nomFamille: string
  description?: string
  isArchived: boolean
  createdAt: Date
  updatedAt?: Date
  produits?: ProductModel[]
}
