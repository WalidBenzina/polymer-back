import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID, IsNumber } from 'class-validator'
import { DocumentStatus, DocumentType } from 'src/enums/document.enum'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class CreateDocumentDto {
  @ApiProperty({
    description: 'Le nom du document',
    example: 'Document name',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le nom du document est requis' })
  nomDocument: string

  @ApiProperty({
    description: 'Le type de document',
    example: DocumentType.INVOICE,
    enum: DocumentType,
  })
  @IsEnum(DocumentType, {
    message: `Le type doit être l'une des valeurs suivantes : ${Object.values(DocumentType).join(', ')}`,
  })
  @IsNotEmpty()
  type: DocumentType

  @ApiProperty({
    description: 'Le type MIME du fichier',
    example: 'application/pdf',
  })
  @IsString()
  @IsNotEmpty()
  mimeType: string

  @ApiProperty({
    description: 'La taille du fichier en octets',
    example: 1024,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'La taille doit être un nombre valide' })
  @IsNotEmpty()
  size: number

  @ApiProperty({
    description: 'La clé S3 du fichier',
    example: 'document-key',
  })
  @IsString()
  @IsNotEmpty()
  s3Key: string

  @ApiProperty({
    description: 'Le statut du document',
    example: DocumentStatus.PENDING,
    enum: DocumentStatus,
  })
  @IsEnum(DocumentStatus, {
    message: `Le statut doit être l'une des valeurs suivantes : ${Object.values(DocumentStatus).join(', ')}`,
  })
  @IsOptional()
  statut?: DocumentStatus

  @ApiProperty({
    description: "L'ID de la commande associée au document",
    example: 'd2e8b93e-f508-4ca6-b03c-34e927150d8b',
  })
  @IsUUID()
  @IsNotEmpty({
    message: "L'ID de la commande est requis pour associer le document",
  })
  commande: string
}
