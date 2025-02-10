import { IsNotEmpty, IsNumber, IsEnum, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { MethodPaiement } from 'src/enums/method-paiement.enum'
import { PaiementStatus } from 'src/enums/paiement-status.enum'

export class CreatePaiementDto {
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
    example: PaiementStatus.PENDING,
  })
  @IsNotEmpty()
  @IsEnum(PaiementStatus)
  statut: PaiementStatus

  @ApiProperty({
    description: "L'identifiant de la commande associée au paiement",
    type: Number,
    example: 'd2e8b93e-f508-4ca6-b03c-34e927150d8b',
  })
  @IsNotEmpty()
  @IsUUID()
  idCommande: string

  @ApiProperty({
    description: "L'identifiant de l'utilisateur effectuant le paiement",
    type: Number,
    example: 'd2e8b93e-f508-4ca6-b03c-34e927150d8b',
  })
  @IsNotEmpty()
  @IsUUID()
  idUtilisateur: string
}
