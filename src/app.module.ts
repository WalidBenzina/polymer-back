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
import { Commande } from './commande/commande.entity'
import { Document } from './document/document.entity'
import { Paiement } from './paiement/paiement.entity'
import { SeuilProduit } from './produit_seuils/produit_seuil.entity'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigurationModule } from './configuration/configuration.module'
import { DocumentModule } from './document/document.module'
import { MulterModule } from '@nestjs/platform-express'
import { OffreDePrixModule } from './offre-de-prix/offre-de-prix.module'
import { PaiementModule } from './paiement/paiement.module'
import { Configuration } from './configuration/configuration.entity'
import { DatabaseModule } from './seeders/database.module'
import { MarineTrafficModule } from './marine-traffic/marine-traffic.module'
import { ProduitSeuilsModule } from './produit_seuils/produit_seuils.module'
import { S3Module } from './s3/s3.module'
import { OffreDePrix } from './offre-de-prix/offre-de-prix.entity'

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
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      entities: [
        User,
        Client,
        Role,
        Product,
        Commande,
        Configuration,
        Document,
        Paiement,
        OffreDePrix,
        SeuilProduit,
      ],
      synchronize: true,
    }),
    AuthModule,
    RoleModule,
    ClientModule,
    ProductModule,
    CommandeModule,
    UserModule,
    ConfigurationModule,
    DocumentModule,
    OffreDePrixModule,
    PaiementModule,
    DatabaseModule,
    MarineTrafficModule,
    ProduitSeuilsModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
