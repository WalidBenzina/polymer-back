import { IsNotEmpty, IsEmail, IsString, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ClientStatus } from 'src/enums/client-status.enum'

export class CreateClientDto {
  @ApiProperty({ example: 'John Doe', description: 'Le nom du client' })
  @IsNotEmpty()
  @IsString()
  nomClient: string

  @ApiProperty({ example: 'johndoe@example.com', description: "L'email du client" })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ example: '+1234567890', description: 'Le numéro de téléphone du client' })
  @IsNotEmpty()
  @IsString()
  telephone: string

  @ApiProperty({ example: '123 Rue Exemple, Paris', description: "L'adresse du client" })
  @IsNotEmpty()
  @IsString()
  adresse: string

  @ApiProperty({
    example: ClientStatus.ACTIVE,
    description: 'Statut du client',
    enum: ClientStatus,
  })
  @IsEnum(ClientStatus)
  statut: ClientStatus
}
