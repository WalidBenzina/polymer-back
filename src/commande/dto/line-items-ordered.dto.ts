import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString, ValidateNested, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import SalesUnit from '../../enums/sales-unit.enum'
import { ProductOrderedDto } from './product-ordered.dto'

export class LineItemOrderedDto {
  @ApiProperty({
    type: ProductOrderedDto,
    description: 'Le produit associé à cette ligne',
  })
  @ValidateNested()
  @Type(() => ProductOrderedDto)
  readonly produit: ProductOrderedDto

  @ApiProperty({
    example: 2,
    description: "La quantité commandée (nombre d'unités)",
  })
  @IsNumber()
  readonly quantite: number

  @ApiProperty({
    example: SalesUnit.PALETTE_1000,
    description: "L'unité de vente (KG, PALETTE_1000, PALETTE_1500, CONTAINER_20, CONTAINER_40)",
    enum: SalesUnit,
  })
  @IsEnum(SalesUnit)
  readonly uniteVente: SalesUnit

  @ApiProperty({
    example: 1000,
    description: 'Le poids total en kg pour cette ligne',
  })
  @IsNumber()
  readonly poidsTotal: number

  @ApiProperty({
    example: 2.5,
    description:
      'Le prix unitaire par kg pour cette ligne (peut différer du prix standard du produit)',
  })
  @IsNumber()
  readonly prixUnitaire: number

  @ApiProperty({
    example: 'active',
    description: 'Le statut de la ligne',
  })
  @IsString()
  readonly statut: string

  @ApiProperty({
    example: 2500,
    description: 'Le total HT de la ligne (poidsTotal * prixUnitaire)',
  })
  @IsNumber()
  readonly totalHt: number

  @ApiProperty({
    example: 500,
    description: 'Le total des taxes de la ligne',
  })
  @IsNumber()
  readonly totalTax: number

  @ApiProperty({
    example: 3000,
    description: 'Le total TTC de la ligne (totalHt + totalTax)',
  })
  @IsNumber()
  readonly totalTtc: number
}
