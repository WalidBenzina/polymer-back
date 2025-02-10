import { UserStatus } from 'src/enums/user-status.enum'
import { ClientModel } from './client.model'
import { CommandeModel } from './commande.model'
import { RoleModel } from './role.model'
import { PaiementModel } from './paiement.model'

export interface UserModel {
  idUtilisateur: number
  nomUtilisateur: string
  email: string
  motDePasse: string
  idRole: RoleModel
  idClient?: ClientModel | null
  commandes?: CommandeModel[]
  paiements?: PaiementModel[]
  statut: UserStatus
  createdAt: Date
  updatedAt?: Date
}
