import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { Client } from '../client/client.entity'
import { User } from 'src/user/user.entity'
import { BaseEntity } from '../base/base.entity'
import { CommandeStatus } from 'src/enums/commande-status.enum'
import { LineItem } from '../lineitem/lineitem.entity'
import { Document } from 'src/document/document.entity'
import { Paiement } from 'src/paiement/paiement.entity'
import { RemiseType } from 'src/enums/remise-type.enum'
import { DevisStatus } from 'src/enums/devis-status.enum'
import { EcheancePaiement } from '../echeance-paiement/echeance-paiement.entity'

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

  @OneToMany(() => EcheancePaiement, (echeance) => echeance.commande, { cascade: true })
  echeancesPaiement: EcheancePaiement[]

  // Nouveaux champs pour les coûts additionnels
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  prixLivraison: number

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  prixEmmagasinage: number

  // Champs pour les remises
  @Column({ type: 'enum', enum: RemiseType, nullable: true })
  remiseType: RemiseType

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  remiseValeur: number

  // Statut du devis (pour validation par le client)
  @Column({
    type: 'enum',
    enum: DevisStatus,
    default: DevisStatus.PENDING,
    nullable: true,
  })
  devisStatus: DevisStatus

  // Prix final après ajout des coûts et remises
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  prixFinal: number
}
