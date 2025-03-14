import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { DatabaseSeeder } from './seeders/database.seeder'
import { SeedCommand } from './seeders/seed.command'
import { Role } from './role/role.entity'
import { User } from './user/user.entity'
import { Client } from './client/client.entity'
import { Product } from './product/product.entity'
import { ProductFamily } from './product-family/product-family.entity'
import { Commande } from './commande/commande.entity'
import { Document } from './document/document.entity'
import { Paiement } from './paiement/paiement.entity'
import { LineItem } from './lineitem/lineitem.entity'
import { dataSourceOptions } from '../database/datasource'
import { EcheancePaiement } from './echeance-paiement/echeance-paiement.entity'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      entities: [
        Role,
        User,
        Client,
        Product,
        ProductFamily,
        Commande,
        Document,
        Paiement,
        LineItem,
        EcheancePaiement,
      ],
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([
      Role,
      User,
      Client,
      Product,
      ProductFamily,
      Commande,
      Document,
      Paiement,
      LineItem,
      EcheancePaiement,
    ]),
  ],
  providers: [DatabaseSeeder, SeedCommand],
})
export class CliModule {}
