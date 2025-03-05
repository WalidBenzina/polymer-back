import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsUUID,
} from 'class-validator'
import { Type } from 'class-transformer'
import { CreateCommandeDto } from './create-commande.dto'
import { LigneItemOrderedDto } from './ligne-items-ordered.dto'

export class UpdateCommandeDto extends PartialType(CreateCommandeDto) {
  @ApiProperty({
    example: '2024-10-28',
    description: 'La date de la commande au format YYYY-MM-DD',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  readonly dateCommande?: string

  @ApiProperty({
    example: 'uuid client',
    description: "L'ID du client (optionnel)",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  readonly client?: string

  @ApiProperty({
    example: 'uuid user',
    description: "L'ID de l'utilisateur qui a créé la commande",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  readonly utilisateur?: string

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
    example: 'CMD-2024001',
    description: 'La référence unique de la commande',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly refCommande?: string

  @ApiProperty({
    type: [LigneItemOrderedDto],
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
  @Type(() => LigneItemOrderedDto)
  @IsOptional()
  readonly ligneItems?: LigneItemOrderedDto[]

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
}
