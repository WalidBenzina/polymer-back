import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LineItem } from './lineitem.entity'
import { LineItemService } from './lineitem.service'
import { Product } from '../product/product.entity'

@Module({
  imports: [TypeOrmModule.forFeature([LineItem, Product])],
  providers: [LineItemService],
  exports: [LineItemService],
})
export class LineItemModule {}
