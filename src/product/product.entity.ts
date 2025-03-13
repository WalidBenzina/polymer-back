import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { BaseEntity } from '../base/base.entity'
import ProductStatus from 'src/enums/product-status.enum'
import StockStatus from 'src/enums/stock-status.enum'
import { ProductFamily } from '../product-family/product-family.entity'

@Entity('produits')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idProduit: string

  @Column()
  nomProduit: string

  @Column()
  description: string

  @Column({ type: 'decimal', comment: 'Prix de vente par kg' })
  prix: number

  @Column({ type: 'decimal', comment: "Prix d'achat par kg" })
  prixAchat: number

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

  @Column({ type: 'varchar', length: 255, unique: true })
  sku: string

  @Column({ type: 'varchar', length: 255 })
  urlImage: string

  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true })
  evaluation: number

  @Column({ type: 'int', default: 0, nullable: true })
  nombreVendu: number

  @Column({ type: 'decimal', nullable: true })
  tauxTVA?: number

  @Column({ type: 'boolean', default: false })
  taxeActivee?: boolean

  @Column({ default: false })
  isArchived: boolean

  @ManyToOne('ProductFamily', 'produits', { nullable: false })
  @JoinColumn({ name: 'idFamille' })
  famille: ProductFamily

  @Column()
  idFamille: string
}
