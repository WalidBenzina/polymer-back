import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { Client } from '../client/client.entity'
import { User } from 'src/user/user.entity'
import { BaseEntity } from '../base/base.entity'
import { CommandeStatus } from 'src/enums/commande-status.enum'
import { LineItem } from '../lineitem/lineitem.entity'
import { Document } from 'src/document/document.entity'
import { Paiement } from 'src/paiement/paiement.entity'

@Entity('commandes')
export class Commande extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idCommande: string

  @Column({ type: 'date' })
  dateCommande: Date

  @ManyToOne(() => Client, (client) => client.commandes, { nullable: true })
  client: Client

  @ManyToOne(() => User, (user) => user.commandes, { nullable: false })
  utilisateur: User

  @Column({
    type: 'enum',
    enum: CommandeStatus,
    default: CommandeStatus.PENDING,
  })
  statut: CommandeStatus

  @Column({ type: 'date', nullable: true })
  dateLivraisonPrevue: string

  @Column({ type: 'date', nullable: true })
  dateLivraisonReelle: string

  @Column({ type: 'varchar', length: 50, unique: true })
  refCommande: string

  @OneToMany(() => LineItem, (lineItem) => lineItem.commande, { cascade: true })
  lineItems: LineItem[]

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalHt: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalTaxe: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalTtc: number

  @OneToMany(() => Document, (document) => document.commande)
  documents: Document[]

  @OneToMany(() => Paiement, (paiement) => paiement.idCommande)
  paiements: Paiement[]
}
