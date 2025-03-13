import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { User } from '../user/user.entity'
import { Commande } from '../commande/commande.entity'
import { BaseEntity } from '../base/base.entity'
import { ClientStatus } from '../enums/client-status.enum'
import { OffreDePrix } from '../offre-de-prix/offre-de-prix.entity'

@Entity('clients')
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idClient: string

  @Column()
  nomClient: string

  @Column({ unique: true })
  email: string

  @Column()
  adresse: string

  @Column()
  telephone: string

  @OneToMany(() => User, (user) => user.idClient)
  utilisateurs: User[]

  @OneToMany(() => Commande, (commande) => commande.client)
  commandes: Commande[]

  @Column({
    type: 'enum',
    enum: ClientStatus,
    default: ClientStatus.ACTIVE,
  })
  statut: ClientStatus

  @OneToMany(() => OffreDePrix, (offreDePrix) => offreDePrix.client)
  offresDePrix: OffreDePrix[]
}
