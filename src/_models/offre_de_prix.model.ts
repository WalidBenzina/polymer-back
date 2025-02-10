import { OffreDePrixStatus } from 'src/enums/offre-de-prix-status.enum'
import { ClientModel } from './client.model'

export interface offreDePrixModel {
  idOffre: number
  description: string
  montant: number
  client: ClientModel
  statut: OffreDePrixStatus
  createdAt: Date
  updatedAt: Date
}
