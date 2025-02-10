import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsUUID,
} from 'class-validator'
import { CommandeStatus } from 'src/enums/commande-status.enum'
import { Type } from 'class-transformer'
import { LineItem } from 'src/_models/lineitem.model'
import { CreateCommandeDto } from './create-commande.dto'
import { LineItemStatus } from 'src/enums/line-item-status.enum'

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
    type: [Object],
    description: 'Les articles de la commande',
    required: false,
    example: [
      {
        id_line_item: 1,
        product_id: 101,
        product_name: 'Produit A',
        quantity: 2,
        total_ht: 200.0,
        total_tax: 40.0,
        total_ttc: 240.0,
        status: LineItemStatus.ACTIVE,
        created_at: '2024-10-28T00:00:00Z',
        updated_at: '2024-10-28T00:00:00Z',
      },
      {
        id_line_item: 2,
        product_id: 102,
        product_name: 'Produit B',
        quantity: 1,
        total_ht: 150.0,
        total_tax: 30.0,
        total_ttc: 180.0,
        status: LineItemStatus.ACTIVE,
        created_at: '2024-10-28T00:00:00Z',
        updated_at: '2024-10-28T00:00:00Z',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsOptional()
  readonly ligneItems?: LineItem[]

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
