import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsUUID,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import ProductStatus from 'src/enums/product-status.enum'
import StockStatus from 'src/enums/stock-status.enum'

export class CreateProductDto {
  @ApiProperty({ example: 'Produit 1', description: 'Le nom du produit' })
  @IsNotEmpty()
  @IsString()
  nomProduit: string

  @ApiProperty({ example: 'Description du produit', description: 'La description du produit' })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({ example: 29.99, description: 'Le prix du produit (prix à la tonne)' })
  @IsNotEmpty()
  @IsNumber()
  prix: number

  @ApiProperty({ example: 299.99, description: 'Le prix du produit à la palette' })
  @IsOptional()
  @IsNumber()
  prixPalette?: number

  @ApiProperty({ example: 2999.99, description: 'Le prix du produit au container' })
  @IsOptional()
  @IsNumber()
  prixContainer?: number

  @ApiProperty({ example: 100, description: 'Quantité disponible du produit' })
  @IsNotEmpty()
  @IsNumber()
  quantiteDisponible: number

  @ApiProperty({
    example: ProductStatus.INACTIF,
    description: 'Statut du produit',
    enum: ProductStatus,
  })
  @IsNotEmpty()
  @IsEnum(ProductStatus)
  statut: ProductStatus

  @ApiProperty({
    example: StockStatus.DISPONIBLE,
    description: 'Statut du stock',
    enum: StockStatus,
  })
  @IsNotEmpty()
  @IsEnum(StockStatus)
  statutStock: StockStatus

  @ApiProperty({ example: 'SKU-12345', description: 'Le SKU du produit' })
  @IsNotEmpty()
  @IsString()
  sku: string

  @ApiProperty({ example: 1.5, description: 'Le poids du produit en kg' })
  @IsNotEmpty()
  @IsNumber()
  poids: number

  @ApiProperty({
    example: 'http://example.com/image.jpg',
    description: "URL de l'image du produit",
    required: false,
  })
  @IsOptional()
  @IsString()
  urlImage?: string

  @ApiProperty({ example: 4.5, description: 'Note du produit sur 5' })
  @IsOptional()
  @IsNumber()
  evaluation?: number

  @ApiProperty({ example: 200, description: "Nombre d'unités vendues" })
  @IsOptional()
  @IsNumber()
  nombreVendu?: number

  @ApiProperty({ example: 35.99, description: 'Le prix de vente du produit' })
  @IsNotEmpty()
  @IsNumber()
  prixVente: number

  @ApiProperty({
    example: 20.0,
    description: "Le prix d'achat du produit",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  prixAchat?: number

  @ApiProperty({
    example: 0.2,
    description: 'Taux de TVA appliqué au produit',
  })
  @IsNotEmpty()
  @IsNumber()
  tauxTVA: number

  @ApiProperty({
    example: true,
    description: 'Indique si la taxe est activée pour le produit',
  })
  @IsNotEmpty()
  @IsBoolean()
  taxeActivee: boolean

  @ApiProperty({
    example: 10.0,
    description: 'Hauteur du produit en cm',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  hauteur?: number

  @ApiProperty({
    example: 5.0,
    description: 'Largeur du produit en cm',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  largeur?: number

  @ApiProperty({
    example: 20.0,
    description: 'Longueur du produit en cm',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  longueur?: number

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la famille de produits',
  })
  @IsNotEmpty()
  @IsUUID()
  idFamille: string
}
