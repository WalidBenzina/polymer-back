import { IsInt, IsOptional, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class PaginationDto {
  @ApiProperty({ description: 'pages number', example: 1, required: false })
  page: number = 4

  @ApiProperty({ description: 'Number of elements per page', example: 10, required: false })
  limit: number = 10
}
