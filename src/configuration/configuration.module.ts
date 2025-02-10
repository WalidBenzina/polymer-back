import { Module } from '@nestjs/common'
import { ConfigurationService } from './configuration.service'
import { ConfigurationController } from './configuration.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Configuration } from './configuration.entity'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([Configuration]), AuthModule],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
})
export class ConfigurationModule {}
