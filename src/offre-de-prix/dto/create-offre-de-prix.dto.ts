import { IsNotEmpty, IsString, IsNumber, IsEnum, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { OffreDePrixStatus } from 'src/enums/offre-de-prix-status.enum'

export class CreateOffreDePrixDto {
  @ApiProperty({
    description: "La description de l'offre de prix.",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({
    description: "Le montant de l'offre de prix.",
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  montant: number

  @ApiProperty({
    description: "L'ID du client auquel cette offre de prix est associée.",
    type: String,
    example: 'd2e8b93e-f508-4ca6-b03c-34e927150d8b',
  })
  @IsUUID()
  @IsNotEmpty()
  client: string

  @ApiProperty({
    description: "Le statut de l'offre de prix.",
    enum: OffreDePrixStatus,
    default: OffreDePrixStatus.PENDING,
  })
  @IsEnum(OffreDePrixStatus)
  statut: OffreDePrixStatus
}
