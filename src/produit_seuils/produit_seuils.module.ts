import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SeuilProduitService } from './produit_seuils.service'
import { SeuilProduitController } from './produit_seuils.controller'
import { SeuilProduit } from './produit_seuil.entity'
import { Product } from 'src/product/product.entity'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([SeuilProduit, Product]), AuthModule],
  controllers: [SeuilProduitController],
  providers: [SeuilProduitService],
  exports: [SeuilProduitService],
})
export class ProduitSeuilsModule {}
