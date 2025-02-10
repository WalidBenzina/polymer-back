import { User } from 'src/user/user.entity'
import { RoleStatus } from 'src/enums/role-status.enum'

export interface RoleModel {
  idRole: number
  nomRole: string
  permissions: string[]
  users?: User[]
  statut: RoleStatus
  createdAt: Date
  updatedAt?: Date
}
