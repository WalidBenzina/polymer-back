import { ClientStatus } from 'src/enums/client-status.enum'
import { UserResponse } from './user-response.interface'

export interface ClientResponse {
  idClient: string
  nomClient: string
  email: string
  adresse: string
  telephone: string
  statut: ClientStatus
  utilisateurs: UserResponse[]
}
