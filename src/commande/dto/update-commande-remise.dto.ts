import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, Min } from 'class-validator'
import { RemiseType } from 'src/enums/remise-type.enum'

export class UpdateCommandeRemiseDto {
  @ApiProperty({
    enum: RemiseType,
    example: RemiseType.PERCENTAGE,
    description: 'Le type de remise (pourcentage ou montant fixe)',
    required: true,
  })
  @IsEnum(RemiseType)
  readonly remiseType: RemiseType

  @ApiProperty({
    example: 10.0,
    description: 'La valeur de la remise (pourcentage ou montant)',
    required: true,
  })
  @IsNumber()
  @Min(0)
  readonly remiseValeur: number
}
