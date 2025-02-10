import { IsOptional, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateDocumentDto {
  @ApiProperty({
    description: 'Le nom du document',
    example: 'Document name',
  })
  @IsOptional()
  nomDocument: string
}
