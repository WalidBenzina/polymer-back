import { Module } from '@nestjs/common'
import { CommandeService } from './commande.service'
import { CommandeController } from './commande.controller'
import { Commande } from './commande.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Client } from 'src/client/client.entity'
import { User } from 'src/user/user.entity'
import { AuthModule } from 'src/auth/auth.module'
import { Product } from 'src/product/product.entity'
import { DocumentsService } from 'src/document/document.service'
import { DocumentModule } from '../document/document.module'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { S3Module } from '../s3/s3.module'
import { Paiement } from 'src/paiement/paiement.entity'
import { LineItem } from 'src/lineitem/lineitem.entity'
import { LineItemService } from 'src/lineitem/lineitem.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Commande, Client, User, Product, Paiement, LineItem]),
    AuthModule,
    DocumentModule,
    MulterModule.register({
      storage: memoryStorage(),
    }),
    S3Module,
  ],
  controllers: [CommandeController],
  providers: [CommandeService, DocumentsService, LineItemService],
  exports: [CommandeService],
})
export class CommandeModule {}
