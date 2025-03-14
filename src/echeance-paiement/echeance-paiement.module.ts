import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EcheancePaiement } from './echeance-paiement.entity'
import { EcheancePaiementService } from './echeance-paiement.service'
import { EcheancePaiementController } from './echeance-paiement.controller'
import { Commande } from 'src/commande/commande.entity'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([EcheancePaiement, Commande]), AuthModule],
  providers: [EcheancePaiementService],
  controllers: [EcheancePaiementController],
  exports: [EcheancePaiementService],
})
export class EcheancePaiementModule {}
