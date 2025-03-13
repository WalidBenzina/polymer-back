import { ApiProperty } from '@nestjs/swagger'
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
import { LineItemStatus } from 'src/enums/line-item-status.enum'
import { LineItemOrderedDto } from './line-items-ordered.dto'

export class CreateCommandeDto {
  @ApiProperty({
    example: '2024-10-28',
    description: 'La date de la commande au format YYYY-MM-DD',
  })
  @IsDateString()
  readonly dateCommande: string

  @ApiProperty({
    example: 'd2e8b93e-f508-4ca6-b03c-34e927150d8b',
    description: "L'ID du client (optionnel)",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  readonly client?: string

  @ApiProperty({
    example: 'd2e8b93e-f508-4ca6-b03c-34e927150d8b',
    description: "L'ID de l'utilisateur qui a créé la commande",
  })
  @IsUUID()
  readonly utilisateur: string

  @ApiProperty({
    example: CommandeStatus.PENDING,
    enum: CommandeStatus,
    description: 'Le statut de la commande',
  })
  @IsEnum(CommandeStatus)
  readonly statut: CommandeStatus

  @ApiProperty({
    example: 'CMD-2024001',
    description: 'La référence unique de la commande',
  })
  @IsString()
  readonly refCommande: string

  @ApiProperty({
    type: [Object],
    description: 'Les articles de la commande',
    required: false,
    example: [
      {
        idLineItem: 1,
        productId: 'uuid',
        productName: 'Produit A',
        quantity: 2,
        totalHt: 200.0,
        totalTax: 40.0,
        totalTtc: 240.0,
        statut: LineItemStatus.ACTIVE,
        createdAt: '2024-10-28T00:00:00Z',
        updatedAt: '2024-10-28T00:00:00Z',
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
  })
  @IsNumber()
  readonly totalHt: number

  @ApiProperty({
    example: 100.0,
    description: 'Le montant total des taxes de la commande',
  })
  @IsNumber()
  readonly totalTaxe: number

  @ApiProperty({
    example: 600.0,
    description: 'Le total TTC de la commande',
  })
  @IsNumber()
  readonly totalTtc: number
}
