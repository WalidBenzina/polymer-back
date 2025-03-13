import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, IsUUID, IsBoolean } from 'class-validator'

export class ProductOrderedDto {
  @ApiProperty({
    example: 'dd078d34-49bb-43a4-aa8e-b6bf624abea3',
    description: "L'ID du produit",
  })
  @IsUUID()
  readonly idProduit: string

  @ApiProperty({
    example: 'RPET Flakes Clear',
    description: 'Le nom du produit',
  })
  @IsString()
  @IsOptional()
  readonly nomProduit?: string

  @ApiProperty({
    example: 'Recycled PET flakes, clear color, suitable for food packaging',
    description: 'La description du produit',
  })
  @IsString()
  @IsOptional()
  readonly description?: string

  @ApiProperty({
    example: 1.2,
    description: 'Le prix de vente par kg',
  })
  @IsNumber()
  @IsOptional()
  readonly prix?: number

  @ApiProperty({
    example: 0.95,
    description: "Le prix d'achat par kg",
  })
  @IsNumber()
  @IsOptional()
  readonly prixAchat?: number

  @ApiProperty({
    example: 'ACTIF',
    description: 'Le statut du produit',
  })
  @IsString()
  @IsOptional()
  readonly statut?: string

  @ApiProperty({
    example: 'Disponible',
    description: 'Le statut du stock',
  })
  @IsString()
  @IsOptional()
  readonly statutStock?: string

  @ApiProperty({
    example: 'RPET-FL-CLR-001',
    description: 'Le SKU du produit',
  })
  @IsString()
  @IsOptional()
  readonly sku?: string

  @ApiProperty({
    example: 20,
    description: 'Taux de TVA appliqué au produit',
  })
  @IsNumber()
  @IsOptional()
  readonly tauxTVA?: number

  @ApiProperty({
    example: true,
    description: 'Indique si la taxe est activée pour ce produit',
  })
  @IsBoolean()
  @IsOptional()
  readonly taxeActivee?: boolean
}
