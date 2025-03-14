import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, Min } from 'class-validator'

export class UpdateCommandeAdditionalCostsDto {
  @ApiProperty({
    example: 50.0,
    description: 'Le prix de livraison',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly prixLivraison?: number

  @ApiProperty({
    example: 30.0,
    description: "Le prix d'emmagasinage",
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly prixEmmagasinage?: number
}
