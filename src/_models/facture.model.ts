import { CommandeModel } from './commande.model'

export interface factureModel {
  idFacture: number
  dateFacture: Date
  commande: CommandeModel
  createdAt: Date
  updatedAt: Date
}
