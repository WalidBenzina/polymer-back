import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { Role } from 'src/role/role.entity'
import { Client } from 'src/client/client.entity'
import { Commande } from 'src/commande/commande.entity'
import { BaseEntity } from '../base/base.entity'
import { UserStatus } from 'src/enums/user-status.enum'
import { Paiement } from 'src/paiement/paiement.entity'

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idUtilisateur: string

  @Column()
  nomUtilisateur: string

  @Column({ unique: true })
  email: string

  @Column()
  motDePasse: string

  @ManyToOne(() => Role, (role) => role.users)
  role: Role

  @ManyToOne(() => Client, (client) => client.utilisateurs, { nullable: true })
  idClient: Client | null

  @OneToMany(() => Commande, (commande) => commande.utilisateur)
  commandes: Commande[] | null

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  statut: UserStatus

  @OneToMany(() => Paiement, (paiement) => paiement.idUtilisateur)
  paiements: Paiement[]
}
