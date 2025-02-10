import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Commande } from 'src/commande/commande.entity'
import { BaseEntity } from 'src/base/base.entity'
import { DocumentStatus, DocumentType } from 'src/enums/document.enum'

@Entity('Documents')
export class Document extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idDocument: string

  @Column()
  nomDocument: string

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  type: string

  @Column()
  mimeType: string

  @Column()
  size: number

  @Column({ nullable: true })
  s3Key: string

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  statut: DocumentStatus

  @ManyToOne(() => Commande, (commande) => commande.documents)
  commande: Commande
}
