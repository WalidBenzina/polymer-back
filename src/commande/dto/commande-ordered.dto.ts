import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString, IsUUID, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { LineItemOrderedDto } from './line-items-ordered.dto'

export class CommandeOrderedDto {
  @ApiProperty({
    example: 'fb3fea98-ce12-43b5-9560-ead1669ba50b',
    description: "L'ID du client",
  })
  @IsUUID()
  readonly client: string

  @ApiProperty({
    example: '53c3e094-61dd-428f-91cf-466f249d5631',
    description: "L'ID de l'utilisateur",
  })
  @IsUUID()
  readonly utilisateur: string

  @ApiProperty({
    example: '2025-03-08',
    description: 'La date de livraison prévue',
  })
  @IsString()
  readonly dateLivraisonPrevue: string

  @ApiProperty({
    type: [LineItemOrderedDto],
    description: 'Les articles de la commande',
  })
  @ValidateNested({ each: true })
  @Type(() => LineItemOrderedDto)
  readonly lineItems: LineItemOrderedDto[]

  @ApiProperty({
    example: 2500,
    description: 'Le total HT de la commande',
  })
  @IsNumber()
  readonly totalHt: number

  @ApiProperty({
    example: 500,
    description: 'Le total des taxes de la commande',
  })
  @IsNumber()
  readonly totalTaxe: number

  @ApiProperty({
    example: 3000,
    description: 'Le total TTC de la commande',
  })
  @IsNumber()
  readonly totalTtc: number
}
