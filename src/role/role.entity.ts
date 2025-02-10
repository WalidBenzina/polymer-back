import { User } from 'src/user/user.entity'
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { BaseEntity } from '../base/base.entity'
import { RoleStatus } from 'src/enums/role-status.enum'
import { IsEnum, IsOptional } from 'class-validator'

@Entity('roles')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idRole: string

  @Column()
  nomRole: string

  @Column('simple-array')
  permissions: string[]

  @OneToMany(() => User, (user) => user.role)
  users: User[]

  @Column({
    type: 'enum',
    enum: RoleStatus,
    default: RoleStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(RoleStatus)
  statut?: RoleStatus
}
