import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator'
import { PaiementStatus } from 'src/enums/paiement-status.enum'

export class CreateEcheancePaiementDto {
  @ApiProperty({
    example: '2024-12-31',
    description: "Date d'échéance du paiement",
    required: true,
  })
  @IsDateString()
  readonly dateEcheance: string

  @ApiProperty({
    example: 500.0,
    description: 'Montant à payer pour cette échéance',
    required: true,
  })
  @IsNumber()
  @Min(0)
  readonly montant: number

  @ApiProperty({
    enum: PaiementStatus,
    example: PaiementStatus.PENDING,
    description: "Statut de l'échéance de paiement",
    required: false,
    default: PaiementStatus.PENDING,
  })
  @IsEnum(PaiementStatus)
  @IsOptional()
  readonly statut?: PaiementStatus

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la commande associée',
    required: true,
  })
  @IsUUID()
  readonly commande: string

  @ApiProperty({
    example: 'Premier versement',
    description: "Description de l'échéance de paiement",
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly description?: string
}
