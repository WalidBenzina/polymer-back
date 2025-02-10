import { Commande } from 'src/commande/commande.entity'
import { DocumentStatus, DocumentType } from 'src/enums/document.enum'

export interface DocumentModel {
  idDocument: number
  type: DocumentType
  mimeType: string
  size: number
  s3Key: string
  nomDocument: string
  statut: DocumentStatus
  createdAt: Date
  updatedAt: Date
  commande: Commande
}
