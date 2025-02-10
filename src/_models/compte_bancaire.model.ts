import { CompteBancaireType } from 'src/enums/compte-bancaire-type.enum'
import { UserModel } from './user.model'

export interface compteBancaireModel {
  idCompte: number
  nomBanque: string
  numeroCompte: string
  titulaire: string
  statut: CompteBancaireType
  utilisateur: UserModel
  createdAt: Date
  updatedAt: Date
}
