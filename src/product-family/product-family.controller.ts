import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ProductFamilyService } from './product-family.service'
import { ProductFamilyModel } from 'src/_models/product-family.model'
import { CreateProductFamilyDto } from './dto/create-product-family.dto'
import { UpdateProductFamilyDto } from './dto/update-product-family.dto'
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { FilterProductFamilyDto } from './dto/filter-product-family.dto'
import { PermissionsGuard } from 'src/auth/guards/permissions.guard'
import { JwtAuthGuard } from 'src/auth/local-auth.guard'
import { Permissions } from 'src/auth/decorators/permissions.decorator'
import { PermissionType } from 'src/common/types/permissions.type'

@ApiTags('Product Families Management')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('familles-produits')
export class ProductFamilyController {
  constructor(private readonly productFamilyService: ProductFamilyService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle famille de produits' })
  @ApiResponse({ status: 201, description: 'Famille de produits créée avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides ou erreur de création.' })
  @Permissions(PermissionType.WRITE_PRODUCT)
  async create(
    @Body() createProductFamilyDto: CreateProductFamilyDto
  ): Promise<ProductFamilyModel> {
    try {
      return await this.productFamilyService.create(createProductFamilyDto)
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message || 'Erreur lors de la création de la famille de produits.',
        },
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les familles de produits' })
  @ApiResponse({
    status: 200,
    description: 'Liste des familles de produits récupérée avec succès.',
  })
  @Permissions(PermissionType.READ_PRODUCT)
  async findAll(@Query() filterProductFamilyDto: FilterProductFamilyDto): Promise<{
    data: ProductFamilyModel[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    try {
      return await this.productFamilyService.findAll(filterProductFamilyDto)
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message || 'Erreur lors de la récupération des familles de produits.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une famille de produits par son ID' })
  @ApiResponse({ status: 200, description: 'Famille de produits récupérée avec succès.' })
  @ApiResponse({ status: 404, description: 'Famille de produits non trouvée.' })
  @Permissions(PermissionType.READ_PRODUCT)
  async findOne(@Param('id') id: string): Promise<ProductFamilyModel> {
    try {
      return await this.productFamilyService.findOne(id)
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message || 'Erreur lors de la récupération de la famille de produits.',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une famille de produits' })
  @ApiResponse({ status: 200, description: 'Famille de produits mise à jour avec succès.' })
  @ApiResponse({ status: 404, description: 'Famille de produits non trouvée.' })
  @Permissions(PermissionType.WRITE_PRODUCT)
  async update(
    @Param('id') id: string,
    @Body() updateProductFamilyDto: UpdateProductFamilyDto
  ): Promise<ProductFamilyModel> {
    try {
      return await this.productFamilyService.update(id, updateProductFamilyDto)
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message || 'Erreur lors de la mise à jour de la famille de produits.',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une famille de produits' })
  @ApiResponse({ status: 200, description: 'Famille de produits supprimée avec succès.' })
  @ApiResponse({ status: 404, description: 'Famille de produits non trouvée.' })
  @Permissions(PermissionType.DELETE_PRODUCT)
  async deleteProductFamily(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const result = await this.productFamilyService.remove(id)
      return { message: result }
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message || 'Erreur lors de la suppression de la famille de produits.',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restaurer une famille de produits supprimée' })
  @ApiResponse({ status: 200, description: 'Famille de produits restaurée avec succès.' })
  @ApiResponse({ status: 404, description: 'Famille de produits non trouvée.' })
  @Permissions(PermissionType.WRITE_PRODUCT)
  async restoreProductFamily(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const result = await this.productFamilyService.restore(id)
      return { message: result }
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message || 'Erreur lors de la restauration de la famille de produits.',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
