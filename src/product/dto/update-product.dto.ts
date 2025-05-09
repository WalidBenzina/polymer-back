import { IsOptional, IsString, IsNumber, IsEnum, IsBoolean, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import ProductStatus from 'src/enums/product-status.enum'
import StockStatus from 'src/enums/stock-status.enum'

export class UpdateProductDto {
  @ApiProperty({ example: 'Produit 1', description: 'Le nom du produit', required: false })
  @IsOptional()
  @IsString()
  nomProduit?: string

  @ApiProperty({
    example: 'Description du produit',
    description: 'La description du produit',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({
    example: 29.99,
    description: 'Le prix de vente par kg',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  prix?: number

  @ApiProperty({
    example: 20.0,
    description: "Le prix d'achat par kg",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  prixAchat?: number

  @ApiProperty({
    example: 100,
    description: 'Quantité disponible du produit en kg',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  quantiteDisponible?: number

  @ApiProperty({
    example: ProductStatus.ACTIF,
    description: 'Statut du produit',
    enum: ProductStatus,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  statut?: ProductStatus

  @ApiProperty({
    example: StockStatus.DISPONIBLE,
    description: 'Statut du stock',
    enum: StockStatus,
  })
  @IsOptional()
  @IsEnum(StockStatus)
  statutStock?: StockStatus

  @ApiProperty({ example: 'SKU-12345', description: 'Le SKU du produit', required: false })
  @IsOptional()
  @IsString()
  sku?: string

  @ApiProperty({
    example: 'http://example.com/image.jpg',
    description: "URL de l'image du produit",
    required: false,
  })
  @IsOptional()
  @IsString()
  urlImage?: string

  @ApiProperty({ example: 4.5, description: 'Note du produit sur 5', required: false })
  @IsOptional()
  @IsNumber()
  evaluation?: number

  @ApiProperty({ example: 200, description: "Nombre d'unités vendues", required: false })
  @IsOptional()
  @IsNumber()
  nombreVendu?: number

  @ApiProperty({ example: 0.2, description: 'Taux de TVA appliqué au produit', required: false })
  @IsOptional()
  @IsNumber()
  tauxTVA?: number

  @ApiProperty({
    example: true,
    description: 'Indique si la taxe est activée pour le produit',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  taxeActivee?: boolean

  @ApiProperty({
    example: false,
    description: 'Indique si le produit est archivé',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la famille de produits',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  idFamille?: string
}
