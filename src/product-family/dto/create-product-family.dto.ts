import { IsNotEmpty, IsString, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateProductFamilyDto {
  @ApiProperty({ example: 'Électronique', description: 'Le nom de la famille de produits' })
  @IsNotEmpty()
  @IsString()
  nomFamille: string

  @ApiProperty({
    example: 'Tous les produits électroniques',
    description: 'La description de la famille de produits',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string
}
