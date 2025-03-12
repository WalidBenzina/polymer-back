import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './product.entity'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { AuthModule } from '../auth/auth.module'
import { PermissionsGuard } from 'src/auth/guards/permissions.guard'
import { ProductFamily } from '../product-family/product-family.entity'
import { ProductFamilyService } from '../product-family/product-family.service'
import { ProductFamilyController } from '../product-family/product-family.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductFamily]), AuthModule],
  controllers: [ProductController, ProductFamilyController],
  providers: [ProductService, ProductFamilyService, PermissionsGuard],
  exports: [ProductService, ProductFamilyService],
})
export class ProductModule {}
