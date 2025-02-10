import { Commande } from '../commande/commande.entity'
import { DocumentStatus } from '../enums/document.enum'

export interface DocumentResponse {
  idDocument: string
  nomDocument: string
  type: string
  mimeType: string
  size: number
  s3Key: string
  statut: DocumentStatus
  commande: Commande
}
