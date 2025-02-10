import {
  Controller,
  Query,
  Get,
  Patch,
  Post,
  Delete,
  Put,
  Body,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'
import { DocumentsService } from './document.service'
import { UpdateDocumentDto } from './dto/update-document.dto'
import { CreateDocumentDto } from './dto/create-document.dto'
import { ApiTags, ApiResponse, ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger'
import { PaginationDto } from 'src/pagination/pagination.dto'
import { DocumentStatus } from 'src/enums/document.enum'
import { DocumentResponse } from 'src/interfaces/document-response.interface'

import { PermissionsGuard } from 'src/auth/guards/permissions.guard'
import { JwtAuthGuard } from 'src/auth/local-auth.guard'
import { Permissions } from 'src/auth/decorators/permissions.decorator'
import { PermissionType } from 'src/common/types/permissions.type'

@ApiTags('Documents')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Permissions(PermissionType.CREATE_DOCUMENT)
  @ApiOperation({ summary: 'Ajouter un document à une commande' })
  @ApiResponse({
    status: 201,
    description: 'Document ajouté avec succès.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur interne.',
  })
  async addDocument(@Body() createDocumentDto: CreateDocumentDto): Promise<DocumentResponse> {
    try {
      const document = await this.documentsService.addDocumentToCommande(createDocumentDto)
      if (!document) {
        throw new NotFoundException('Document could not be created')
      }
      return document
    } catch {
      throw new Error("Une erreur est survenue lors de l'ajout du document.")
    }
  }

  @Get()
  @Permissions(PermissionType.READ_DOCUMENT)
  @ApiOperation({ summary: 'Obtenir la liste des documents avec pagination' })
  @ApiResponse({
    status: 200,
    description: 'Liste des documents récupérée avec succès.',
  })
  @ApiResponse({
    status: 404,
    description: 'Aucun document trouvé.',
  })
  async getDocuments(@Query() paginationDto: PaginationDto): Promise<{
    data: DocumentResponse[]
    total: number
    currentPage: number
    totalPages: number
  }> {
    try {
      const { data, total, currentPage, totalPages } =
        await this.documentsService.findAll(paginationDto)

      return {
        data,
        total,
        currentPage,
        totalPages,
      }
    } catch {
      throw new Error('Une erreur est survenue lors de la récupération des documents.')
    }
  }

  @Get(':idDocument')
  @Permissions(PermissionType.READ_DOCUMENT)
  @ApiOperation({ summary: 'Obtenir une Document par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Document retrieved successfully',
  })
  async findOne(@Param('idDocument') idDocument: string): Promise<DocumentResponse> {
    try {
      return this.documentsService.findOne(idDocument)
    } catch {
      throw new Error('Une erreur est survenue lors de la récupération du document.')
    }
  }

  @Put(':idDocument')
  @Permissions(PermissionType.UPDATE_DOCUMENT)
  @ApiOperation({ summary: "Mise à jour d'un document" })
  @ApiResponse({
    status: 200,
    description: 'Document updated successfully',
  })
  async updateDocument(
    @Param('idDocument') idDocument: string,
    @Body() updateDocumentDto: UpdateDocumentDto
  ): Promise<DocumentResponse> {
    try {
      return this.documentsService.updateDocument(idDocument, updateDocumentDto)
    } catch {
      throw new Error('Une erreur est survenue lors de la mise à jour du document.')
    }
  }

  @Delete(':idDocument')
  @Permissions(PermissionType.DELETE_DOCUMENT)
  @ApiOperation({ summary: 'suprimer un document' })
  @ApiResponse({
    status: 200,
    description: 'Document deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Document with specified ID not found',
  })
  async remove(@Param('idDocument') idDocument: string): Promise<string> {
    try {
      return this.documentsService.remove(idDocument)
    } catch {
      throw new Error('Une erreur est survenue lors de la suppression du document.')
    }
  }

  @Patch(':idDocument/status')
  @ApiBody({
    description: 'Status of the document to update (VALIDATED or REJECTED)',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['accepted', 'rejected'] },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Document status updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid status provided',
  })
  @ApiResponse({
    status: 404,
    description: 'Document with specified ID not found',
  })
  async validateOrRejectDocument(
    @Param('idDocument') idDocument: string,
    @Body('status') status: DocumentStatus
  ): Promise<DocumentResponse> {
    return this.documentsService.validateOrRejectDocument(idDocument, status)
  }

  @Patch(':idDocument/file')
  @Permissions(PermissionType.UPDATE_DOCUMENT)
  @ApiOperation({ summary: 'Replace the file of a document' })
  @ApiResponse({
    status: 200,
    description: 'Document file updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
  })
  async replaceFile(
    @Param('idDocument') idDocument: string,
    @Body() updateFileDto: { s3Key: string; nomDocument: string; mimeType: string; size: number }
  ): Promise<DocumentResponse> {
    return this.documentsService.replaceFile(idDocument, updateFileDto)
  }

  @Get(':idDocument/download-url')
  @Permissions(PermissionType.READ_DOCUMENT)
  @ApiOperation({ summary: 'Get the download URL for a document' })
  @ApiResponse({
    status: 200,
    description: 'Download URL retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Document with specified ID not found',
  })
  async getDownloadUrl(@Param('idDocument') idDocument: string): Promise<{ url: string }> {
    const url = await this.documentsService.getDownloadUrl(idDocument)
    return { url }
  }
}
