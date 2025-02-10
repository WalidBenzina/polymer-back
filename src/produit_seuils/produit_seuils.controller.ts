import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  HttpException,
  HttpStatus,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger'
import { SeuilProduitService } from './produit_seuils.service'
import { CreateSeuilDto } from './dto/create-seuil.dto'
import { UpdateSeuilsDto } from './dto/update-seuil.dto'
import { SeuilProduit } from './produit_seuil.entity'

import { PermissionsGuard } from 'src/auth/guards/permissions.guard'
import { JwtAuthGuard } from 'src/auth/local-auth.guard'
import { PaginationDto } from 'src/pagination/pagination.dto'

@ApiTags('SeuilProduit')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('seuils')
export class SeuilProduitController {
  constructor(private readonly seuilProduitService: SeuilProduitService) {}

  @ApiOperation({ summary: 'Créer des seuils pour un produit' })
  @ApiParam({ name: 'productId', description: 'Identifiant du produit' })
  @ApiBody({ type: CreateSeuilDto })
  @Post(':productId')
  async createSeuils(
    @Param('productId') productId: string,
    @Body() createSeuilDto: CreateSeuilDto
  ): Promise<{ message: string }> {
    try {
      return await this.seuilProduitService.createSeuils(productId, createSeuilDto)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @ApiOperation({ summary: "Mettre à jour les seuils d'un produit" })
  @ApiParam({ name: 'productId', description: 'Identifiant du produit' })
  @ApiBody({ type: UpdateSeuilsDto })
  @Put(':productId')
  async updateSeuils(
    @Param('productId') productId: string,
    @Body() updateSeuilDto: UpdateSeuilsDto
  ): Promise<{ message: string }> {
    try {
      return await this.seuilProduitService.updateSeuils(productId, updateSeuilDto)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @ApiOperation({ summary: 'Récupérer tous les seuils' })
  @Get()
  async findAllSeuils(@Query() paginationDto: PaginationDto): Promise<{
    data: SeuilProduit[]
    total: number
    currentPage: number
    totalPages: number
  }> {
    return this.seuilProduitService.findAllSeuils(paginationDto)
  }

  @ApiOperation({ summary: "Récupérer le seuil d'un produit" })
  @ApiParam({ name: 'productId', description: 'Identifiant du produit' })
  @Get(':productId')
  async findOneSeuil(@Param('productId') productId: string): Promise<SeuilProduit> {
    try {
      return await this.seuilProduitService.findOneSeuil(productId)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND)
    }
  }

  @ApiOperation({ summary: "Suprimer une seuils d'un produit" })
  @Delete(':productId')
  async deleteSeuil(@Param('productId') productId: string): Promise<{ message: string }> {
    return this.seuilProduitService.deleteSeuil(productId)
  }
}
