import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator'
import { Type } from 'class-transformer'

export class FilterProductFamilyDto {
  @ApiProperty({ description: 'Page number', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page: number = 1

  @ApiProperty({ description: 'Number of elements per page', example: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number = 10

  @ApiProperty({ description: 'Search query for family name', required: false })
  @IsOptional()
  @IsString()
  search?: string

  @ApiProperty({
    description: 'Sort field and direction (e.g., "nomFamille,asc", "createdAt,desc")',
    required: false,
  })
  @IsOptional()
  @IsString()
  sort?: string

  @ApiProperty({
    description: 'Include archived families in results',
    required: false,
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeArchived?: boolean = false
}
