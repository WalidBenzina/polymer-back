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

  @ApiProperty({ example: 29.99, description: 'Le prix de vente par kg' })
  @IsNotEmpty()
  @IsNumber()
  prix: number

  @ApiProperty({
    example: 20.0,
    description: "Le prix d'achat par kg",
    required: false,
  })
  @IsNotEmpty()
  @IsNumber()
  prixAchat: number

  @ApiProperty({ example: 100, description: 'Quantité disponible du produit en kg' })
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
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la famille de produits',
  })
  @IsNotEmpty()
  @IsUUID()
  idFamille: string
}
