import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm'
import { Product } from 'src/product/product.entity'

@Entity('seuil_produit')
export class SeuilProduit {
  @PrimaryGeneratedColumn('uuid')
  idSeuil: string

  @Column({ type: 'decimal' })
  seuilMinimal: number

  @Column({ type: 'decimal' })
  seuilReapprovisionnement: number

  @OneToOne(() => Product)
  @JoinColumn({ name: 'idProduit' })
  produit: Product
}
