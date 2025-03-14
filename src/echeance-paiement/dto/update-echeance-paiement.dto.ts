import { PartialType } from '@nestjs/swagger'
import { CreateEcheancePaiementDto } from './create-echeance-paiement.dto'

export class UpdateEcheancePaiementDto extends PartialType(CreateEcheancePaiementDto) {}
