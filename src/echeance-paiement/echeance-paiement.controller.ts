import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  NotFoundException,
} from '@nestjs/common'
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { EcheancePaiementService } from './echeance-paiement.service'
import { CreateEcheancePaiementDto } from './dto/create-echeance-paiement.dto'
import { UpdateEcheancePaiementDto } from './dto/update-echeance-paiement.dto'
import { EcheancePaiement } from './echeance-paiement.entity'
import { JwtAuthGuard } from 'src/auth/local-auth.guard'
import { PermissionsGuard } from 'src/auth/guards/permissions.guard'
import { Permissions } from 'src/auth/decorators/permissions.decorator'
import { PermissionType } from 'src/common/types/permissions.type'

@ApiTags('Échéances de Paiement')
@ApiBearerAuth('JWT-auth')
@Controller('echeances-paiement')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EcheancePaiementController {
  constructor(private readonly echeancePaiementService: EcheancePaiementService) {}

  @Get()
  @Permissions(PermissionType.READ_ECHEANCE_PAYMENT)
  @ApiOperation({ summary: 'Récupérer toutes les échéances de paiement' })
  @ApiResponse({
    status: 200,
    description: 'Liste des échéances de paiement récupérée avec succès.',
    type: [EcheancePaiement],
  })
  async findAll(): Promise<EcheancePaiement[]> {
    return this.echeancePaiementService.findAll()
  }

  @Get('commande/:id')
  @Permissions(PermissionType.READ_ECHEANCE_PAYMENT)
  @ApiOperation({ summary: "Récupérer les échéances de paiement d'une commande" })
  @ApiResponse({
    status: 200,
    description: 'Liste des échéances de paiement récupérée avec succès.',
    type: [EcheancePaiement],
  })
  async findByCommande(@Param('id') id: string): Promise<EcheancePaiement[]> {
    return this.echeancePaiementService.findByCommande(id)
  }

  @Get(':id')
  @Permissions(PermissionType.READ_ECHEANCE_PAYMENT)
  @ApiOperation({ summary: 'Récupérer une échéance de paiement par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Échéance de paiement récupérée avec succès.',
    type: EcheancePaiement,
  })
  @ApiResponse({
    status: 404,
    description: 'Échéance de paiement non trouvée.',
  })
  async findOne(@Param('id') id: string): Promise<EcheancePaiement> {
    try {
      return await this.echeancePaiementService.findOne(id)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new NotFoundException(`Échéance de paiement avec ID ${id} non trouvée`)
    }
  }

  @Post()
  @Permissions(PermissionType.CREATE_ECHEANCE_PAYMENT)
  @ApiOperation({ summary: 'Créer une nouvelle échéance de paiement' })
  @ApiResponse({
    status: 201,
    description: 'Échéance de paiement créée avec succès.',
    type: EcheancePaiement,
  })
  async create(
    @Body() createEcheancePaiementDto: CreateEcheancePaiementDto
  ): Promise<EcheancePaiement> {
    return this.echeancePaiementService.create(createEcheancePaiementDto)
  }

  @Put(':id')
  @Permissions(PermissionType.UPDATE_ECHEANCE_PAYMENT)
  @ApiOperation({ summary: 'Mettre à jour une échéance de paiement' })
  @ApiResponse({
    status: 200,
    description: 'Échéance de paiement mise à jour avec succès.',
    type: EcheancePaiement,
  })
  @ApiResponse({
    status: 404,
    description: 'Échéance de paiement non trouvée.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateEcheancePaiementDto: UpdateEcheancePaiementDto
  ): Promise<EcheancePaiement> {
    return this.echeancePaiementService.update(id, updateEcheancePaiementDto)
  }

  @Delete(':id')
  @Permissions(PermissionType.DELETE_ECHEANCE_PAYMENT)
  @ApiOperation({ summary: 'Supprimer une échéance de paiement' })
  @ApiResponse({
    status: 200,
    description: 'Échéance de paiement supprimée avec succès.',
  })
  @ApiResponse({
    status: 404,
    description: 'Échéance de paiement non trouvée.',
  })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.echeancePaiementService.remove(id)
    return { message: `Échéance de paiement avec ID ${id} supprimée avec succès` }
  }
}
