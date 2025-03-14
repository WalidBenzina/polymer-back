import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { BaseEntity } from '../base/base.entity'
import { Commande } from '../commande/commande.entity'
import { PaiementStatus } from '../enums/paiement-status.enum'

@Entity('echeances_paiement')
export class EcheancePaiement extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idEcheance: string

  @Column({ type: 'date' })
  dateEcheance: Date

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montant: number

  @Column({
    type: 'enum',
    enum: PaiementStatus,
    default: PaiementStatus.PENDING,
  })
  statut: PaiementStatus

  @ManyToOne(() => Commande, (commande) => commande.echeancesPaiement, { nullable: false })
  commande: Commande

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string
}
