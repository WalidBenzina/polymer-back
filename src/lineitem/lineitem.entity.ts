import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { BaseEntity } from '../base/base.entity'
import { LineItemStatus } from '../enums/line-item-status.enum'
import { Product } from '../product/product.entity'
import { Commande } from '../commande/commande.entity'
import SalesUnit from '../enums/sales-unit.enum'

@Entity('line_items')
export class LineItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  idLineItem: number

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'produit_id' })
  produit: Product

  @ManyToOne(() => Commande, (commande) => commande.lineItems)
  @JoinColumn({ name: 'commande_id' })
  commande: Commande

  @Column()
  quantite: number

  @Column({
    type: 'enum',
    enum: SalesUnit,
    default: SalesUnit.PALETTE,
  })
  uniteVente: SalesUnit

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalHt: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalTax: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalTtc: number

  @Column({
    type: 'enum',
    enum: LineItemStatus,
    default: LineItemStatus.ACTIVE,
  })
  statut: LineItemStatus
}
