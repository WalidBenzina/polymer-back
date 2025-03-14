import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { DevisStatus } from 'src/enums/devis-status.enum'

export class UpdateCommandeDevisStatusDto {
  @ApiProperty({
    enum: DevisStatus,
    example: DevisStatus.ACCEPTED,
    description: 'Le statut du devis',
    required: true,
  })
  @IsEnum(DevisStatus)
  readonly devisStatus: DevisStatus
}
