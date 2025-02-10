import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { MarineTrafficService } from './marine-traffic.service'
import { AuthModule } from 'src/auth/auth.module'
import { MarineTrafficController } from './marine-traffic.controller'

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [MarineTrafficController],
  providers: [MarineTrafficService],
})
export class MarineTrafficModule {}
