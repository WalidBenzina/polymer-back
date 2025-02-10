import { UserStatus } from 'src/enums/user-status.enum'
import { RoleResponse } from './role-response.interface'
import { ClientResponse } from './client-response.interface'

export interface UserResponse {
  idUtilisateur: string
  nomUtilisateur: string
  email: string
  statut: UserStatus
  role: RoleResponse
  idClient: ClientResponse | null
}
