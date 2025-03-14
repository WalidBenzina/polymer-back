import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
  NotFoundException,
  Put,
  InternalServerErrorException,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common'
import { CommandeService } from './commande.service'
import { DocumentsService } from '../document/document.service'
import { CreateCommandeDto } from './dto/create-commande.dto'
import { UpdateCommandeDto } from './dto/update-commande.dto'
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { PaginationDto } from 'src/pagination/pagination.dto'
import { CommandeResponse } from 'src/interfaces/commande-response'

import { PermissionsGuard } from 'src/auth/guards/permissions.guard'
import { JwtAuthGuard } from 'src/auth/local-auth.guard'
import { Permissions } from 'src/auth/decorators/permissions.decorator'
import { PermissionType } from 'src/common/types/permissions.type'
import { UpdateCommandeStatusDto } from './dto/update-commande-statut.dto'
import { Commande } from './commande.entity'
import { CreateDocumentDto } from '../document/dto/create-document.dto'
import { DocumentResponse } from '../interfaces/document-response.interface'
import { FileInterceptor } from '@nestjs/platform-express'
import { DocumentStatus } from '../enums/document.enum'
import { CommandeOrderedDto } from './dto/commande-ordered.dto'
import { CommandeStatus } from '../enums/commande-status.enum'
import { UpdateCommandeAdditionalCostsDto } from './dto/update-commande-additional-costs.dto'
import { UpdateCommandeRemiseDto } from './dto/update-commande-remise.dto'
import { UpdateCommandeDevisStatusDto } from './dto/update-commande-devis-status.dto'

@ApiTags('Commande Management')
@ApiBearerAuth('JWT-auth')
@Controller('/commandes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CommandeController {
  constructor(
    private readonly commandeService: CommandeService,
    private readonly documentsService: DocumentsService
  ) {}

  @Post()
  @Permissions(PermissionType.CREATE_ORDER)
  @ApiResponse({ status: 201, description: 'Commande créée avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiOperation({ summary: 'Create a new commande.' })
  async create(@Body() commandeOrderedDto: CommandeOrderedDto): Promise<CommandeResponse> {
    try {
      // Convert CommandeOrderedDto to CreateCommandeDto
      const createCommandeDto: CreateCommandeDto = {
        client: commandeOrderedDto.client,
        utilisateur: commandeOrderedDto.utilisateur,
        dateCommande: new Date().toISOString(),
        statut: CommandeStatus.PENDING,
        refCommande: `CMD-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        lineItems: commandeOrderedDto.lineItems,
        totalHt: commandeOrderedDto.totalHt,
        totalTaxe: commandeOrderedDto.totalTaxe,
        totalTtc: commandeOrderedDto.totalTtc,
      }

      return await this.commandeService.create(createCommandeDto)
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error)
      throw new InternalServerErrorException('Erreur lors de la création de la commande')
    }
  }

  @Get()
  @Permissions(PermissionType.READ_ORDER)
  @ApiOperation({ summary: 'Retrieve paginated list of commandes' })
  @ApiResponse({
    status: 200,
    description: 'Commandes retrieved successfully.',
  })
  async findAll(
    @Query() paginationDto: PaginationDto
  ): Promise<{ data: CommandeResponse[]; total: number; currentPage: number; totalPages: number }> {
    const { data, total } = await this.commandeService.findAll(paginationDto)

    const currentPage = paginationDto.page
    const limit = paginationDto.limit
    const totalPages = Math.ceil(total / limit)

    return {
      data,
      total,
      currentPage,
      totalPages,
    }
  }

  @Get(':id')
  @Permissions(PermissionType.READ_ORDER)
  @ApiResponse({ status: 200, description: 'Commande trouvée.' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  @ApiOperation({ summary: 'Retrieve a specific commande by ID.' })
  async findOne(@Param('id') id: string): Promise<CommandeResponse> {
    try {
      return this.commandeService.findOne(id)
    } catch {
      throw new NotFoundException(`Commande avec ID ${id} non trouvée`)
    }
  }

  @Patch(':id')
  @Permissions(PermissionType.UPDATE_ORDER)
  @ApiResponse({
    status: 200,
    description: 'Commande mise à jour avec succès.',
  })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  @ApiOperation({ summary: 'Update a specific commande by ID.' })
  async update(
    @Param('id') id: string,
    @Body() updateCommandeDto: UpdateCommandeDto
  ): Promise<CommandeResponse> {
    return this.commandeService.update(id, updateCommandeDto)
  }

  @Put(':id/status')
  @ApiOperation({ summary: "Met à jour le statut d'une commande" })
  @ApiResponse({
    status: 200,
    description: 'Commande mise à jour avec succès.',
    type: Commande,
  })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  async updateCommandeStatus(
    @Param('id') id: string,
    @Body() updateCommandeStatusDto: UpdateCommandeStatusDto
  ): Promise<CommandeResponse> {
    const { statut } = updateCommandeStatusDto

    try {
      const updatedCommande = await this.commandeService.updateCommandeStatus(id, statut)
      return updatedCommande
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Commande avec ID ${id} non trouvée`)
      }
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la mise à jour du statut de la commande'
      )
    }
  }

  @Delete(':id')
  @Permissions(PermissionType.DELETE_ORDER)
  @ApiResponse({ status: 204, description: 'Commande supprimée avec succès.' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  @ApiOperation({ summary: 'Delete a specific commande by ID.' })
  async deleteCommande(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const message = await this.commandeService.remove(id)
      return { message }
    } catch (error) {
      throw new HttpException(
        error.message,
        error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post(':id/document')
  @Permissions(PermissionType.CREATE_DOCUMENT)
  @UseInterceptors(FileInterceptor('file'))
  async addDocumentToCommande(
    @Param('id') id: string,
    @Body() documentDto: CreateDocumentDto
  ): Promise<DocumentResponse> {
    try {
      // Add the commande ID to the DTO
      documentDto.commande = id
      documentDto.statut = documentDto.statut || DocumentStatus.PENDING

      // Validate size is a number
      if (isNaN(documentDto.size)) {
        throw new BadRequestException('Invalid file size')
      }

      return this.documentsService.addDocumentToCommande(documentDto)
    } catch (error) {
      console.error('Error creating document:', error)
      throw new BadRequestException(error.message || 'Failed to create document')
    }
  }

  @Put(':id/additional-costs')
  @Permissions(PermissionType.UPDATE_ORDER)
  @ApiOperation({ summary: "Mettre à jour les coûts additionnels d'une commande" })
  @ApiResponse({
    status: 200,
    description: 'Coûts additionnels mis à jour avec succès.',
    type: Commande,
  })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  async updateAdditionalCosts(
    @Param('id') id: string,
    @Body() updateCommandeAdditionalCostsDto: UpdateCommandeAdditionalCostsDto
  ): Promise<CommandeResponse> {
    try {
      return await this.commandeService.updateAdditionalCosts(id, updateCommandeAdditionalCostsDto)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la mise à jour des coûts additionnels'
      )
    }
  }

  @Put(':id/remise')
  @Permissions(PermissionType.UPDATE_ORDER)
  @ApiOperation({ summary: "Mettre à jour la remise d'une commande" })
  @ApiResponse({
    status: 200,
    description: 'Remise mise à jour avec succès.',
    type: Commande,
  })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  async updateRemise(
    @Param('id') id: string,
    @Body() updateCommandeRemiseDto: UpdateCommandeRemiseDto
  ): Promise<CommandeResponse> {
    try {
      return await this.commandeService.updateRemise(id, updateCommandeRemiseDto)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la mise à jour de la remise'
      )
    }
  }

  @Put(':id/devis-status')
  @ApiOperation({ summary: "Mettre à jour le statut du devis d'une commande" })
  @ApiResponse({
    status: 200,
    description: 'Statut du devis mis à jour avec succès.',
    type: Commande,
  })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  async updateDevisStatus(
    @Param('id') id: string,
    @Body() updateCommandeDevisStatusDto: UpdateCommandeDevisStatusDto
  ): Promise<CommandeResponse> {
    try {
      return await this.commandeService.updateDevisStatus(id, updateCommandeDevisStatusDto)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la mise à jour du statut du devis'
      )
    }
  }
}
