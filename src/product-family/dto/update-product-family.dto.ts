import { IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateProductFamilyDto {
  @ApiProperty({
    example: 'Électronique',
    description: 'Le nom de la famille de produits',
    required: false,
  })
  @IsOptional()
  @IsString()
  nomFamille?: string

  @ApiProperty({
    example: 'Tous les produits électroniques',
    description: 'La description de la famille de produits',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string
}
