import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OffreDePrixService } from './offre-de-prix.service'
import { OffreDePrix } from './offre-de-prix.entity'
import { Client } from 'src/client/client.entity'
import { OffreDePrixController } from './offre-de-prix.controller'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([OffreDePrix, Client]), AuthModule],
  providers: [OffreDePrixService],
  controllers: [OffreDePrixController],
  exports: [OffreDePrixService],
})
export class OffreDePrixModule {}
