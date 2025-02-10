import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Query } from '@nestjs/common'
import { ConfigurationService } from './configuration.service'
import { CreateConfigurationDto } from './dto/create-configuration.dto'
import { UpdateConfigurationDto } from './dto/update-configuration.dto'
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'

import { PermissionsGuard } from 'src/auth/guards/permissions.guard'
import { JwtAuthGuard } from 'src/auth/local-auth.guard'
import { PaginationDto } from 'src/pagination/pagination.dto'

@ApiTags('Configurations')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('/config')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle configuration' })
  @ApiResponse({
    status: 201,
    description: 'Configuration créée avec succès.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur interne.',
  })
  async create(@Body() createConfigurationDto: CreateConfigurationDto) {
    return this.configurationService.create(createConfigurationDto)
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir toutes les configurations' })
  @ApiResponse({
    status: 200,
    description: 'Configurations récupérées avec succès.',
  })
  @ApiResponse({
    status: 404,
    description: 'Aucune configuration trouvée.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur interne.',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const { data, total, currentPage, totalPages } =
        await this.configurationService.findAll(paginationDto)

      return {
        status: 'success',
        message: 'Configurations récupérées avec succès.',
        data,
        total,
        currentPage,
        totalPages,
      }
    } catch (error) {
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une configuration par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Configuration trouvée.',
  })
  @ApiResponse({
    status: 404,
    description: "Configuration avec l'ID spécifié non trouvée.",
  })
  async findOne(@Param('id') id: string) {
    return this.configurationService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une configuration' })
  @ApiResponse({
    status: 200,
    description: 'Configuration mise à jour avec succès.',
  })
  @ApiResponse({
    status: 404,
    description: "Configuration avec l'ID spécifié non trouvée.",
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur interne.',
  })
  async update(@Param('id') id: string, @Body() updateConfigurationDto: UpdateConfigurationDto) {
    return this.configurationService.update(id, updateConfigurationDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une configuration' })
  @ApiResponse({
    status: 200,
    description: 'Configuration supprimée avec succès.',
  })
  @ApiResponse({
    status: 404,
    description: "Configuration avec l'ID spécifié non trouvée.",
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur interne.',
  })
  async remove(@Param('id') id: string): Promise<string> {
    return this.configurationService.remove(id)
  }
}
