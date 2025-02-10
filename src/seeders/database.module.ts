import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseSeeder } from './database.seeder'
import { Role } from 'src/role/role.entity'
import { User } from 'src/user/user.entity'
import { Client } from 'src/client/client.entity'
import { Product } from 'src/product/product.entity'
import { Commande } from 'src/commande/commande.entity'
import { Document } from 'src/document/document.entity'
import { Paiement } from 'src/paiement/paiement.entity'
import { SeuilProduit } from 'src/produit_seuils/produit_seuil.entity'
import { ProductModule } from 'src/product/product.module'
import { UserModule } from 'src/user/user.module'
import { ClientModule } from 'src/client/client.module'
import { RoleModule } from 'src/role/role.module'
import { CommandeModule } from 'src/commande/commande.module'
import { DocumentModule } from 'src/document/document.module'
import { PaiementModule } from 'src/paiement/paiement.module'
import { ProduitSeuilsModule } from 'src/produit_seuils/produit_seuils.module'

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
  providers: [DatabaseSeeder],
  exports: [DatabaseSeeder],
})
export class DatabaseModule {}
