import { ClientStatus } from 'src/enums/client-status.enum'
import { CommandeModel } from './commande.model'
import { UserModel } from './user.model'
import { offreDePrixModel } from './offre_de_prix.model'

export interface ClientModel {
  idClient: number
  nomClient: string
  email: string
  adresse: string
  telephone: string
  utilisateurs?: UserModel[]
  commandes?: CommandeModel[]
  statut: ClientStatus
  offresDePrix?: offreDePrixModel[]
  createdAt: Date
  updatedAt: Date
}
