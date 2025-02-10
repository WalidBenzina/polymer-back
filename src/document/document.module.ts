import { Module } from '@nestjs/common'
import { DocumentsService } from './document.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Commande } from 'src/commande/commande.entity'
import { Document } from './document.entity'
import { DocumentsController } from './document.controller'
import { AuthModule } from 'src/auth/auth.module'
import { S3Service } from '../s3/s3.service'

@Module({
  imports: [TypeOrmModule.forFeature([Document, Commande]), AuthModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, S3Service],
  exports: [DocumentsService, TypeOrmModule],
})
export class DocumentModule {}
