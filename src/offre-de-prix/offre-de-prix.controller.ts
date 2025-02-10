import { Controller, Post, Body, Patch, Param, Get, ParseIntPipe, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { OffreDePrixService } from './offre-de-prix.service'
import { CreateOffreDePrixDto } from './dto/create-offre-de-prix.dto'
import { UpdateOffreDePrixDto } from './dto/update-offre-de-prix.dto'
import { OffreDePrix } from './offre-de-prix.entity'

import { PermissionsGuard } from 'src/auth/guards/permissions.guard'
import { JwtAuthGuard } from 'src/auth/local-auth.guard'
import { Permissions } from 'src/auth/decorators/permissions.decorator'
import { PermissionType } from 'src/common/types/permissions.type'

@ApiTags('offre de prix')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('/offre-de-prix')
export class OffreDePrixController {
  constructor(private readonly offreDePrixService: OffreDePrixService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle offre de prix' })
  @ApiResponse({
    status: 201,
    description: 'Offre de prix créée avec succès.',
    type: OffreDePrix,
  })
  @ApiResponse({
    status: 400,
    description: "Erreur lors de la création de l'offre de prix.",
  })
  async create(@Body() createOffreDePrixDto: CreateOffreDePrixDto) {
    return this.offreDePrixService.create(createOffreDePrixDto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une offre de prix spécifique par le back office' })
  @ApiResponse({
    status: 200,
    description: 'Offre de prix mise à jour avec succès.',
    type: OffreDePrix,
  })
  @ApiResponse({
    status: 404,
    description: 'Offre de prix non trouvée.',
  })
  async update(@Param('id') id: string, @Body() updateOffreDePrixDto: UpdateOffreDePrixDto) {
    return this.offreDePrixService.update(id, updateOffreDePrixDto)
  }

  @Get('client/:clientId')
  @Permissions(PermissionType.READ_PRICE_OFFER)
  @ApiOperation({ summary: 'Récupérer les dernières offres de prix pour un client' })
  @ApiResponse({
    status: 200,
    description: 'Dernière offre de prix récupérée avec succès.',
    type: [OffreDePrix],
  })
  @ApiResponse({
    status: 404,
    description: 'Aucune offre de prix trouvée pour ce client.',
  })
  async findLatestByClient(@Param('clientId', ParseIntPipe) clientId: string) {
    try {
      const result = await this.offreDePrixService.findLatestByClient(clientId)
      if (!result.data) {
        return {
          statusCode: 404,
          message: result.message,
        }
      }
      return {
        data: result.data,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: "Une erreur s'est produite lors de la récupération de l'offre de prix.",
        error: error.message,
      }
    }
  }
}
