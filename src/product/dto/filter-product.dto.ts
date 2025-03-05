import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator'
import { Type } from 'class-transformer'
import ProductStatus from 'src/enums/product-status.enum'
import StockStatus from 'src/enums/stock-status.enum'

export class FilterProductDto {
  @ApiProperty({ description: 'Page number', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page: number = 1

  @ApiProperty({ description: 'Number of elements per page', example: 12, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number = 12

  @ApiProperty({ description: 'Search query for product name and description', required: false })
  @IsOptional()
  @IsString()
  search?: string

  @ApiProperty({ description: 'Minimum price filter', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  prixMin?: number

  @ApiProperty({ description: 'Maximum price filter', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  prixMax?: number

  @ApiProperty({
    description: 'Product status filter',
    enum: ProductStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  statut?: ProductStatus

  @ApiProperty({
    description: 'Stock status filter',
    enum: StockStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(StockStatus)
  statutStock?: StockStatus

  @ApiProperty({
    description: 'Sort field and direction (e.g., "prix,asc", "createdAt,desc")',
    required: false,
  })
  @IsOptional()
  @IsString()
  sort?: string

  @ApiProperty({
    description: 'Include archived products in results',
    required: false,
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeArchived?: boolean = false
}
