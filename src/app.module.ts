import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'

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
import { OffreDePrixModule } from './offre-de-prix/offre-de-prix.module'
import { PaiementModule } from './paiement/paiement.module'
import { DatabaseModule } from './seeders/database.module'
import { MarineTrafficModule } from './marine-traffic/marine-traffic.module'
import { S3Module } from './s3/s3.module'
import { LineItemModule } from './lineitem/lineitem.module'
import { dataSourceOptions } from '../database/datasource'

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    OffreDePrixModule,
    PaiementModule,
    DatabaseModule,
    MarineTrafficModule,
    S3Module,
    LineItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
