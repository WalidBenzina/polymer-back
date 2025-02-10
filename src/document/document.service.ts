import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Document } from './document.entity'
import { Commande } from 'src/commande/commande.entity'
import { CreateDocumentDto } from './dto/create-document.dto'
import { DocumentStatus } from 'src/enums/document.enum'
import { PaginationDto } from 'src/pagination/pagination.dto'
import { HttpException, HttpStatus } from '@nestjs/common'
import { UpdateDocumentDto } from './dto/update-document.dto'
import { DocumentResponse } from 'src/interfaces/document-response.interface'
import { S3Service } from '../s3/s3.service'

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,

    @InjectRepository(Commande)
    private readonly commandeRepository: Repository<Commande>,

    private readonly s3Service: S3Service
  ) {}

  async addDocumentToCommande(createDocumentDto: CreateDocumentDto): Promise<DocumentResponse> {
    const commande = await this.commandeRepository.findOne({
      where: { idCommande: createDocumentDto.commande },
    })

    if (!commande) {
      throw new NotFoundException('Commande not found')
    }

    const document = this.documentRepository.create({
      nomDocument: createDocumentDto.nomDocument,
      type: createDocumentDto.type,
      mimeType: createDocumentDto.mimeType,
      size: createDocumentDto.size,
      s3Key: createDocumentDto.s3Key,
      statut: DocumentStatus.PENDING,
      commande: commande,
    })

    const savedDocument = await this.documentRepository.save(document)

    return this.toDocumentModel(savedDocument)
  }

  async getDownloadUrl(documentId: string): Promise<string> {
    const document = await this.documentRepository.findOne({ where: { idDocument: documentId } })
    if (!document?.s3Key) throw new Error('Document not found or has no S3 key')

    return this.s3Service.getDownloadUrl(document.s3Key)
  }

  async findAll(paginationDto: PaginationDto): Promise<{
    data: DocumentResponse[]
    total: number
    currentPage: number
    totalPages: number
  }> {
    const { page, limit } = paginationDto

    const [result, total] = await this.documentRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['commande'],
    })

    if (total === 0) {
      throw new NotFoundException('Aucun document trouvé.')
    }

    const totalPages = Math.ceil(total / limit)

    return {
      data: result.map((document) => this.toDocumentModel(document)),
      total: total,
      currentPage: page,
      totalPages: totalPages,
    }
  }

  async findOne(idDocument: string): Promise<DocumentResponse> {
    const document = await this.documentRepository.findOne({
      where: { idDocument: idDocument },
      relations: ['commande'],
    })

    if (!document) {
      throw new NotFoundException(`Document with ID ${idDocument} not found`)
    }

    return this.toDocumentModel(document)
  }

  async updateDocument(
    idDocument: string,
    updateDocumentDto: UpdateDocumentDto
  ): Promise<DocumentResponse> {
    const document = await this.documentRepository.findOne({
      where: { idDocument: idDocument },
      relations: ['commande'],
    })

    if (!document) {
      throw new NotFoundException(`Document with ID ${idDocument} not found`)
    }

    document.nomDocument = updateDocumentDto.nomDocument

    const updatedDocument = await this.documentRepository.save(document)

    return this.toDocumentModel(updatedDocument)
  }

  async remove(idDocument: string): Promise<string> {
    const document = await this.documentRepository.findOne({
      where: { idDocument: idDocument },
    })

    if (!document) {
      throw new NotFoundException(`Document with ID ${idDocument} not found`)
    }
    await this.documentRepository.remove(document)
    return `Document with ID ${idDocument} has been successfully deleted`
  }

  async validateOrRejectDocument(
    idDocument: string,
    status: DocumentStatus
  ): Promise<DocumentResponse> {
    if (![DocumentStatus.ACCEPTED, DocumentStatus.REJECTED].includes(status)) {
      throw new HttpException(
        'Invalid status. Only accepted or rejected are allowed.',
        HttpStatus.BAD_REQUEST
      )
    }

    const document = await this.documentRepository.findOne({
      where: { idDocument: idDocument },
      relations: ['commande'],
    })

    if (!document) {
      throw new NotFoundException(`Document with ID ${idDocument} not found`)
    }

    document.statut = status
    const updatedDocument = await this.documentRepository.save(document)

    return this.toDocumentModel(updatedDocument)
  }

  async replaceFile(
    idDocument: string,
    updateFileDto: { s3Key: string; nomDocument: string; mimeType: string; size: number }
  ): Promise<DocumentResponse> {
    const document = await this.documentRepository.findOne({
      where: { idDocument },
      relations: ['commande'],
    })

    if (!document) {
      throw new NotFoundException(`Document with ID ${idDocument} not found`)
    }

    // Delete old file if exists
    if (document.s3Key) {
      await this.s3Service.deleteFile(document.s3Key)
    }

    // Update document with new file information
    document.s3Key = updateFileDto.s3Key
    document.nomDocument = updateFileDto.nomDocument
    document.mimeType = updateFileDto.mimeType
    document.size = updateFileDto.size

    const updatedDocument = await this.documentRepository.save(document)
    return this.toDocumentModel(updatedDocument)
  }

  private toDocumentModel(document: Document): DocumentResponse {
    return {
      idDocument: document.idDocument,
      nomDocument: document.nomDocument,
      type: document.type,
      mimeType: document.mimeType,
      size: document.size,
      s3Key: document.s3Key,
      statut: document.statut,
      commande: document.commande,
    }
  }
}
