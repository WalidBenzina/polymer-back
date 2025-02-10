import { Controller, Post, Body, Put, Param, Delete, UseGuards, Get } from '@nestjs/common'
import { PaiementService } from './paiement.service'
import { CreatePaiementDto } from './dto/create-paiement.dto'
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { Paiement } from './paiement.entity'
import { UpdatePaiementDto } from './dto/update-paiement.dto'

import { PermissionsGuard } from 'src/auth/guards/permissions.guard'
import { JwtAuthGuard } from 'src/auth/local-auth.guard'
import { Permissions } from 'src/auth/decorators/permissions.decorator'
import { PermissionType } from 'src/common/types/permissions.type'

@ApiTags('Paiement')
@ApiBearerAuth('JWT-auth')
@Controller('paiements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PaiementController {
  constructor(private readonly paiementService: PaiementService) {}

  @Get()
  @Permissions(PermissionType.READ_PAYMENT)
  @ApiOperation({ summary: 'Récupérer tous les paiements' })
  @ApiResponse({
    status: 200,
    description: 'Liste des paiements récupérée avec succès.',
    type: [Paiement],
  })
  async getAll(): Promise<Paiement[]> {
    return this.paiementService.getAllPaiements()
  }

  @Get(':id')
  @Permissions(PermissionType.READ_PAYMENT)
  @ApiOperation({ summary: 'Récupérer un paiement par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Paiement récupéré avec succès.',
    type: Paiement,
  })
  async getOne(@Param('id') id: string): Promise<Paiement> {
    return this.paiementService.getPaiementById(id)
  }

  @Post()
  @Permissions(PermissionType.CREATE_PAYMENT)
  @ApiOperation({ summary: 'Créer un nouveau paiement' })
  @ApiResponse({
    status: 201,
    description: 'Le paiement a été créé avec succès.',
    type: Paiement,
  })
  @ApiResponse({
    status: 400,
    description: 'Les données envoyées sont incorrectes ou manquantes.',
  })
  @ApiResponse({
    status: 500,
    description: 'Une erreur interne est survenue.',
  })
  async create(@Body() createPaiementDto: CreatePaiementDto): Promise<Paiement> {
    return this.paiementService.addPaiement(createPaiementDto)
  }

  @Put(':id')
  @Permissions(PermissionType.UPDATE_PAYMENT)
  @ApiOperation({ summary: 'Modifier un paiement existant' })
  @ApiResponse({
    status: 200,
    description: 'Le paiement a été modifié avec succès.',
    type: Paiement,
  })
  @ApiResponse({
    status: 400,
    description: 'Les données envoyées sont incorrectes ou manquantes.',
  })
  @ApiResponse({
    status: 404,
    description: "Le paiement ou la commande n'a pas été trouvé.",
  })
  @ApiResponse({
    status: 500,
    description: 'Une erreur interne est survenue.',
  })
  async modify(
    @Param('id') id_paiement: string,
    @Body() updatePaiementDto: UpdatePaiementDto
  ): Promise<Paiement> {
    return this.paiementService.modifyPaiement(id_paiement, updatePaiementDto)
  }

  @Delete(':id')
  @Permissions(PermissionType.DELETE_PAYMENT)
  @ApiOperation({ summary: 'Supprimer un paiement' })
  @ApiResponse({
    status: 200,
    description: 'Le paiement a été supprimé avec succès.',
  })
  @ApiResponse({
    status: 404,
    description: "Le paiement n'a pas été trouvé.",
  })
  async delete(@Param('id') id_paiement: string): Promise<string> {
    return this.paiementService.deletePaiement(id_paiement)
  }
}
