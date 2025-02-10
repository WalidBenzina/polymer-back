import { IsOptional, IsString, IsNumber, IsEnum, IsBoolean } from 'class-validator'
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

  @ApiProperty({ example: 29.99, description: 'Le prix du produit', required: false })
  @IsOptional()
  @IsNumber()
  prix?: number

  @ApiProperty({ example: 100, description: 'Quantité disponible du produit', required: false })
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
    example: StockStatus.BACK_ORDER,
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

  @ApiProperty({ example: 1.5, description: 'Le poids du produit en kg', required: false })
  @IsOptional()
  @IsNumber()
  poids?: number

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

  @ApiProperty({ example: 35.99, description: 'Le prix de vente du produit', required: false })
  @IsOptional()
  @IsNumber()
  prixVente?: number

  @ApiProperty({ example: 20.0, description: "Le prix d'achat du produit", required: false })
  @IsOptional()
  @IsNumber()
  prixAchat?: number

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

  @ApiProperty({ example: 10.0, description: 'Hauteur du produit en cm', required: false })
  @IsOptional()
  @IsNumber()
  hauteur?: number

  @ApiProperty({ example: 5.0, description: 'Largeur du produit en cm', required: false })
  @IsOptional()
  @IsNumber()
  largeur?: number

  @ApiProperty({ example: 20.0, description: 'Longueur du produit en cm', required: false })
  @IsOptional()
  @IsNumber()
  longueur?: number
}
