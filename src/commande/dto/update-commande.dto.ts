import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsString,
} from 'class-validator'
import { Type } from 'class-transformer'
import { CreateCommandeDto } from './create-commande.dto'
import { LineItemOrderedDto } from './line-items-ordered.dto'

export class UpdateCommandeDto extends PartialType(CreateCommandeDto) {
  @ApiProperty({
    example: '2024-11-05',
    description: 'La date de livraison prévue au format YYYY-MM-DD',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  readonly dateLivraisonPrevue?: string

  @ApiProperty({
    example: '2024-11-07',
    description: 'La date de livraison réelle au format YYYY-MM-DD',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  readonly dateLivraisonReelle?: string

  @ApiProperty({
    type: [LineItemOrderedDto],
    description: 'Les articles de la commande',
    required: false,
    example: [
      {
        produit: {
          idProduit: 'uuid-produit',
          nomProduit: 'Produit A',
        },
        quantite: 2,
        totalHt: 200.0,
        totalTax: 40.0,
        totalTtc: 240.0,
        statut: 'active',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LineItemOrderedDto)
  @IsOptional()
  readonly lineItems?: LineItemOrderedDto[]

  @ApiProperty({
    example: 500.0,
    description: 'Le total hors taxes de la commande',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  readonly totalHt?: number

  @ApiProperty({
    example: 100.0,
    description: 'Le montant total des taxes de la commande',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  readonly totalTaxe?: number

  @ApiProperty({ example: 600.0, description: 'Le total TTC de la commande', required: false })
  @IsNumber()
  @IsOptional()
  readonly totalTtc?: number

  @ApiProperty({ example: 'pending', description: 'Le statut du devis', required: false })
  @IsString()
  @IsOptional()
  readonly devisStatus?: string

  @ApiProperty({
    example: null,
    description: "Le prix d'emmagasinage de la commande",
    required: false,
  })
  @IsNumber()
  @IsOptional()
  readonly prixEmmagasinage?: number

  @ApiProperty({ example: 96859.56, description: 'Le prix final de la commande', required: false })
  @IsNumber()
  @IsOptional()
  readonly prixFinal?: number

  @ApiProperty({
    example: '109.00',
    description: 'Le prix de livraison de la commande',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  readonly prixLivraison?: number

  @ApiProperty({
    example: 'percentage',
    description: 'Le type de remise',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly remiseType?: string

  @ApiProperty({ example: 10, description: 'La valeur de la remise', required: false })
  @IsNumber()
  @IsOptional()
  readonly remiseValeur?: number
}
