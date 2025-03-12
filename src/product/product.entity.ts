import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { BaseEntity } from '../base/base.entity'
import ProductStatus from 'src/enums/product-status.enum'
import StockStatus from 'src/enums/stock-status.enum'

@Entity('produits')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idProduit: string

  @Column()
  nomProduit: string

  @Column()
  description: string

  @Column({ type: 'decimal' })
  prix: number

  @Column({ type: 'int' })
  quantiteDisponible: number

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.INACTIF,
  })
  statut: ProductStatus

  @Column({
    type: 'enum',
    enum: StockStatus,
    default: StockStatus.DISPONIBLE,
  })
  statutStock: StockStatus

  @Column({ default: false })
  isArchived: boolean

  @Column({ type: 'varchar', length: 255, unique: true })
  sku: string

  @Column({ type: 'float' })
  poids: number

  @Column({ type: 'varchar', length: 255 })
  urlImage: string

  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true })
  evaluation: number

  @Column({ type: 'int', default: 0, nullable: true })
  nombreVendu: number

  @Column({ type: 'decimal', nullable: true })
  prixVente?: number

  @Column({ type: 'decimal', nullable: true })
  prixAchat?: number

  @Column({ type: 'decimal', nullable: true })
  tauxTVA?: number

  @Column({ type: 'boolean', default: false })
  taxeActivee?: boolean

  @Column({ type: 'decimal', nullable: true })
  hauteur?: number

  @Column({ type: 'decimal', nullable: true })
  largeur?: number

  @Column({ type: 'decimal', nullable: true })
  longueur?: number
}
