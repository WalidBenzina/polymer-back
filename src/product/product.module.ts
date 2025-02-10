import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './product.entity'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { AuthModule } from '../auth/auth.module'
import { PermissionsGuard } from 'src/auth/guards/permissions.guard'
import { ProduitSeuilsModule } from 'src/produit_seuils/produit_seuils.module'

@Module({
  imports: [TypeOrmModule.forFeature([Product]), AuthModule, ProduitSeuilsModule],
  controllers: [ProductController],
  providers: [ProductService, PermissionsGuard],
  exports: [ProductService],
})
export class ProductModule {}
