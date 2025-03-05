import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
  Query,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'
import { ClientService } from './client.service'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { PaginationDto } from 'src/pagination/pagination.dto'
import { ClientModel } from 'src/_models/client.model'

import { PermissionsGuard } from 'src/auth/guards/permissions.guard'
import { JwtAuthGuard } from 'src/auth/local-auth.guard'

@ApiTags('Clients Management')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post(':id/activate')
  @ApiResponse({ status: 201, description: 'success activate acount' })
  @ApiResponse({ status: 400, description: 'warnign activated account.' })
  @ApiOperation({ summary: 'Activate client account.' })
  async activateClient(@Param('id') id: string) {
    return this.clientService.activateClient(id)
  }

  @Post(':id/deactivate')
  @ApiResponse({ status: 201, description: 'success deactivate acount' })
  @ApiResponse({ status: 400, description: 'warnign desactivated account.' })
  @ApiOperation({ summary: 'Deactivate client account.' })
  async deactivateClient(@Param('id') id: string) {
    return this.clientService.deactivateClient(id)
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Client créé avec succès avec mot de passe par défaut (téléphone).',
  })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiOperation({ summary: 'Créer un nouveau client.' })
  async create(@Body() clientData: CreateClientDto) {
    try {
      return await this.clientService.create(clientData)
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la création du client.' + error,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer une liste paginée des clients.' })
  @ApiResponse({ status: 200, description: 'Clients récupérés avec succès.' })
  async findAll(
    @Query() paginationDto: PaginationDto
  ): Promise<{ data: ClientModel[]; total: number; currentPage: number; totalPages: number }> {
    return await this.clientService.findAll(paginationDto)
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Client trouvé.' })
  @ApiResponse({ status: 404, description: 'Client non trouvé.' })
  @ApiOperation({ summary: 'Récupérer un client spécifique par son ID.' })
  async findOne(@Param('id') id: string) {
    const client = await this.clientService.findOne(id)
    if (!client) {
      throw new HttpException('Client non trouvé.', HttpStatus.NOT_FOUND)
    }
    return client
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Client mis à jour avec succès.' })
  @ApiResponse({ status: 404, description: 'Client non trouvé.' })
  @ApiResponse({ status: 400, description: 'Données de mise à jour invalides.' })
  @ApiOperation({ summary: 'Mettre à jour un client par ID.' })
  async update(@Param('id') id: string, @Body() updateData: UpdateClientDto) {
    try {
      const updatedClient = await this.clientService.update(id, updateData)
      if (!updatedClient) {
        throw new HttpException('Client non trouvé.', HttpStatus.NOT_FOUND)
      }
      return updatedClient
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la mise à jour du client.' + error,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Client supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Client non trouvé.' })
  @ApiOperation({ summary: 'Supprimer un client par ID.' })
  async deleteClient(@Param('id') id: string) {
    try {
      const message = await this.clientService.remove(id)
      return { message }
    } catch (error) {
      throw new HttpException(
        error.message,
        error instanceof NotFoundException ? HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
