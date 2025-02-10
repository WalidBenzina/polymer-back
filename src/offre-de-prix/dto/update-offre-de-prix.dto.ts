import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { OffreDePrixStatus } from 'src/enums/offre-de-prix-status.enum'

export class UpdateOffreDePrixDto {
  @ApiProperty({
    description: "La description mise à jour de l'offre de prix.",
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({
    description: "Le montant mis à jour de l'offre de prix.",
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  montant?: number

  @ApiProperty({
    description: "Le statut de l'offre de prix.",
    enum: OffreDePrixStatus,
    default: OffreDePrixStatus.PENDING,
  })
  @IsEnum(OffreDePrixStatus)
  statut: OffreDePrixStatus
}
