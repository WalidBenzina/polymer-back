import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ClientStatus } from 'src/enums/client-status.enum'

export class UpdateClientDto {
  @ApiProperty({ example: 'John Doe', description: 'Le nom du client' })
  @IsString()
  nomClient?: string

  @ApiProperty({ example: 'johndoe@example.com', description: "L'email du client" })
  @IsEmail()
  email?: string

  @ApiProperty({
    example: '+1234567890',
    description: 'Le numéro de téléphone du client',
    required: false,
  })
  @IsOptional()
  @IsString()
  telephone?: string

  @ApiProperty({ example: '123 Rue Exemple, Paris', description: "L'adresse du client" })
  @IsString()
  adresse?: string

  @ApiProperty({
    example: ClientStatus.ACTIVE,
    description: 'Statut du client',
    enum: ClientStatus,
    required: false,
  })
  @IsEnum(ClientStatus)
  @IsOptional()
  statut?: ClientStatus
}
