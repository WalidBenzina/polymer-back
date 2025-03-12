import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { BaseEntity } from '../base/base.entity'
import { Product } from '../product/product.entity'

@Entity('familles_produits')
export class ProductFamily extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idFamille: string

  @Column({ unique: true })
  nomFamille: string

  @Column({ nullable: true })
  description: string

  @Column({ default: false })
  isArchived: boolean

  @OneToMany('Product', 'famille')
  produits: Product[]
}
