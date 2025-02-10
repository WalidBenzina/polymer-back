import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Paiement } from './paiement.entity'
import { PaiementService } from './paiement.service'
import { PaiementController } from './paiement.controller'
import { Commande } from 'src/commande/commande.entity'
import { User } from 'src/user/user.entity'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([Paiement, Commande, User]), AuthModule],
  providers: [PaiementService],
  controllers: [PaiementController],
})
export class PaiementModule {}
