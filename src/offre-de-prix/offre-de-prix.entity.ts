import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Client } from 'src/client/client.entity'
import { BaseEntity } from 'src/base/base.entity'
import { OffreDePrixStatus } from 'src/enums/offre-de-prix-status.enum'

@Entity('offreDePrix')
export class OffreDePrix extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idOffre: string

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montant: number

  @Column({
    type: 'enum',
    enum: OffreDePrixStatus,
    default: OffreDePrixStatus.PENDING,
  })
  statut: OffreDePrixStatus

  @ManyToOne(() => Client, (client) => client.offresDePrix)
  client: Client
}
