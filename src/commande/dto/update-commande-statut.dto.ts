import { IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { CommandeStatus } from 'src/enums/commande-status.enum'

export class UpdateCommandeStatusDto {
  @ApiProperty({
    description: 'Le statut actuel de la commande',
    enum: CommandeStatus,
    example: CommandeStatus.ANNULEE,
  })
  @IsEnum(CommandeStatus)
  statut: CommandeStatus
}
