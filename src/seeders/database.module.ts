import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseSeeder } from './database.seeder'
import { SeedCommand } from './seed.command'
import { Role } from '@/role/role.entity'
import { User } from '@/user/user.entity'
import { Client } from '@/client/client.entity'
import { Product } from '@/product/product.entity'
import { Commande } from '@/commande/commande.entity'
import { Document } from '@/document/document.entity'
import { Paiement } from '@/paiement/paiement.entity'
import { SeuilProduit } from '@/produit_seuils/produit_seuil.entity'
import { ProductModule } from '@/product/product.module'
import { UserModule } from '@/user/user.module'
import { ClientModule } from '@/client/client.module'
import { RoleModule } from '@/role/role.module'
import { CommandeModule } from '@/commande/commande.module'
import { DocumentModule } from '@/document/document.module'
import { PaiementModule } from '@/paiement/paiement.module'
import { ProduitSeuilsModule } from '@/produit_seuils/produit_seuils.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      User,
      Client,
      Product,
      Commande,
      Document,
      Paiement,
      SeuilProduit,
    ]),
    ProductModule,
    UserModule,
    ClientModule,
    RoleModule,
    CommandeModule,
    DocumentModule,
    PaiementModule,
    ProduitSeuilsModule,
  ],
  providers: [DatabaseSeeder, SeedCommand],
  exports: [DatabaseSeeder],
})
export class DatabaseModule {}
