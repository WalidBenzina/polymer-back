import { PartialType } from '@nestjs/swagger'
import { CreatePaiementDto } from './create-paiement.dto'
import { IsNotEmpty, IsNumber, IsEnum, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { MethodPaiement } from 'src/enums/method-paiement.enum'
import { PaiementStatus } from 'src/enums/paiement-status.enum'

export class UpdatePaiementDto extends PartialType(CreatePaiementDto) {
  @ApiProperty({
    description: 'Le montant du paiement effectué',
    type: Number,
    example: 150.5,
  })
  @IsNotEmpty()
  @IsNumber()
  montant: number

  @ApiProperty({
    description: 'La méthode de paiement utilisée pour cette transaction',
    enum: MethodPaiement,
    example: MethodPaiement.CHEQUE,
  })
  @IsNotEmpty()
  @IsEnum(MethodPaiement)
  methodePaiement: MethodPaiement

  @ApiProperty({
    description: 'Le statut du paiement (par exemple, payé ou échoué)',
    enum: PaiementStatus,
    example: PaiementStatus.COMPLETED,
  })
  @IsNotEmpty()
  @IsEnum(PaiementStatus)
  statut: PaiementStatus

  @ApiProperty({
    description: "L'identifiant de la commande associée au paiement",
    type: Number,
    example: 'uuid commande',
  })
  @IsNotEmpty()
  @IsUUID()
  idCommande: string
}
