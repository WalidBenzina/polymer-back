import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseSeeder } from './database.seeder'
import { SeedCommand } from './seed.command'
import { Role } from '@/role/role.entity'
import { User } from '@/user/user.entity'
import { Client } from '@/client/client.entity'
import { Product } from '@/product/product.entity'
import { ProductFamily } from '@/product-family/product-family.entity'
import { Commande } from '@/commande/commande.entity'
import { Document } from '@/document/document.entity'
import { Paiement } from '@/paiement/paiement.entity'
import { ProductModule } from '@/product/product.module'
import { UserModule } from '@/user/user.module'
import { ClientModule } from '@/client/client.module'
import { RoleModule } from '@/role/role.module'
import { CommandeModule } from '@/commande/commande.module'
import { DocumentModule } from '@/document/document.module'
import { PaiementModule } from '@/paiement/paiement.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      User,
      Client,
      Product,
      ProductFamily,
      Commande,
      Document,
      Paiement,
    ]),
    ProductModule,
    UserModule,
    ClientModule,
    RoleModule,
    CommandeModule,
    DocumentModule,
    PaiementModule,
  ],
  providers: [DatabaseSeeder, SeedCommand],
  exports: [DatabaseSeeder],
})
export class DatabaseModule {}
