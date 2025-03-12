import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { RoleModule } from './role/role.module'
import { ClientModule } from './client/client.module'
import { ProductModule } from './product/product.module'
import { CommandeModule } from './commande/commande.module'
import { UserModule } from './user/user.module'

import { User } from './user/user.entity'
import { Client } from './client/client.entity'
import { Role } from './role/role.entity'
import { Product } from './product/product.entity'
import { ProductFamily } from './product-family/product-family.entity'
import { Commande } from './commande/commande.entity'
import { Document } from './document/document.entity'
import { Paiement } from './paiement/paiement.entity'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DocumentModule } from './document/document.module'
import { MulterModule } from '@nestjs/platform-express'
import { OffreDePrixModule } from './offre-de-prix/offre-de-prix.module'
import { PaiementModule } from './paiement/paiement.module'
import { DatabaseModule } from './seeders/database.module'
import { MarineTrafficModule } from './marine-traffic/marine-traffic.module'
import { S3Module } from './s3/s3.module'
import { OffreDePrix } from './offre-de-prix/offre-de-prix.entity'
import { LineItemModule } from './lineitem/lineitem.module'
import { LineItem } from './lineitem/lineitem.entity'

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.USER_DB,
      password: process.env.PASSWORD_DB,
      database: process.env.NAME_DB,
      entities: [
        User,
        Client,
        Role,
        Product,
        ProductFamily,
        Commande,
        Document,
        Paiement,
        OffreDePrix,
        LineItem,
      ],
      synchronize: true,
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
