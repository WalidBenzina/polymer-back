import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { APP_FILTER } from '@nestjs/core'

import { AuthModule } from './auth/auth.module'
import { RoleModule } from './role/role.module'
import { ClientModule } from './client/client.module'
import { ProductModule } from './product/product.module'
import { CommandeModule } from './commande/commande.module'
import { UserModule } from './user/user.module'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DocumentModule } from './document/document.module'
import { MulterModule } from '@nestjs/platform-express'
import { PaiementModule } from './paiement/paiement.module'
import { DatabaseModule } from './seeders/database.module'
import { MarineTrafficModule } from './marine-traffic/marine-traffic.module'
import { S3Module } from './s3/s3.module'
import { LineItemModule } from './lineitem/lineitem.module'
import { dataSourceOptions } from '../database/datasource'
import { validationSchema } from './config/validation.schema'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: parseInt(process.env.THROTTLE_LIMIT || '10'),
      },
    ]),
    TypeOrmModule.forRootAsync({
      useFactory: () => dataSourceOptions,
    }),
    AuthModule,
    RoleModule,
    ClientModule,
    ProductModule,
    CommandeModule,
    UserModule,
    DocumentModule,
    PaiementModule,
    DatabaseModule,
    MarineTrafficModule,
    S3Module,
    LineItemModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
