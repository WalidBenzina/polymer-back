import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Commande } from 'src/commande/commande.entity'
import { User } from 'src/user/user.entity'
import { BaseEntity } from 'src/base/base.entity'
import { MethodPaiement } from 'src/enums/method-paiement.enum'
import { PaiementStatus } from 'src/enums/paiement-status.enum'

@Entity('paiements')
export class Paiement extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idPaiement: string

  @Column('decimal', { precision: 10, scale: 2 })
  montant: number

  @Column({
    type: 'enum',
    enum: MethodPaiement,
  })
  methodePaiement: MethodPaiement

  @Column({
    type: 'enum',
    enum: PaiementStatus,
  })
  statut: PaiementStatus

  @ManyToOne(() => Commande, (commande) => commande.paiements, {
    nullable: false,
  })
  idCommande: Commande

  @ManyToOne(() => User, (user) => user.paiements, { nullable: false })
  idUtilisateur: User
}
