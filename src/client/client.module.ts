import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Client } from './client.entity'
import { ClientService } from './client.service'
import { ClientController } from './client.controller'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([Client]), AuthModule],
  providers: [ClientService],
  controllers: [ClientController],
})
export class ClientModule {}
