import { ClientStatus } from 'src/enums/client-status.enum'
import { CommandeModel } from './commande.model'
import { UserModel } from './user.model'

export interface ClientModel {
  idClient: number
  nomClient: string
  email: string
  adresse: string
  telephone: string
  utilisateurs?: UserModel[]
  commandes?: CommandeModel[]
  statut: ClientStatus
  createdAt: Date
  updatedAt: Date
}
