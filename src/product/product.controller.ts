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
import { ProductService } from './product.service'
import { ProductModel } from 'src/_models/product.model'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { FilterProductDto } from './dto/filter-product.dto'
import { PermissionsGuard } from 'src/auth/guards/permissions.guard'
import { JwtAuthGuard } from 'src/auth/local-auth.guard'
import { Permissions } from 'src/auth/decorators/permissions.decorator'
import { PermissionType } from 'src/common/types/permissions.type'

@ApiTags('Products Management')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('produits')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau produit' })
  @ApiResponse({ status: 201, description: 'Produit créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides ou erreur de création.' })
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductModel> {
    try {
      return await this.productService.create(createProductDto)
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message || 'Erreur lors de la création du produit.',
        },
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Get()
  @Permissions(PermissionType.READ_PRODUCT)
  @ApiOperation({ summary: 'Récupérer la liste filtrée et paginée des produits' })
  @ApiResponse({ status: 200, description: 'Produits récupérés avec succès.' })
  @ApiResponse({ status: 400, description: 'Erreur lors de la récupération des produits.' })
  async findAll(@Query() filterProductDto: FilterProductDto): Promise<{
    data: ProductModel[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    try {
      return await this.productService.findAll(filterProductDto)
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message || 'Erreur lors de la récupération des produits.',
        },
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Get(':id')
  @Permissions(PermissionType.READ_PRODUCT)
  @ApiOperation({ summary: 'Récupérer un produit spécifique par ID' })
  @ApiResponse({ status: 200, description: 'Produit trouvé avec succès.' })
  @ApiResponse({ status: 404, description: 'Produit non trouvé.' })
  async findOne(@Param('id') id: string): Promise<ProductModel> {
    const product = await this.productService.findOne(id)
    if (!product) {
      throw new HttpException('Produit non trouvé.', HttpStatus.NOT_FOUND)
    }
    return product
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un produit spécifique par ID' })
  @ApiResponse({ status: 200, description: 'Produit mis à jour avec succès.' })
  @ApiResponse({ status: 400, description: 'Données de mise à jour invalides.' })
  @ApiResponse({ status: 404, description: 'Produit non trouvé pour la mise à jour.' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<ProductModel> {
    try {
      const updatedProduct = await this.productService.update(id, updateProductDto)
      if (!updatedProduct) {
        throw new HttpException('Produit non trouvé.', HttpStatus.NOT_FOUND)
      }
      return updatedProduct
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message || 'Erreur lors de la mise à jour du produit.',
        },
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un produit spécifique par ID' })
  @ApiResponse({ status: 204, description: 'Produit supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Produit non trouvé pour la suppression.' })
  async deleteProduct(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const message = await this.productService.remove(id)
      return { message }
    } catch (error) {
      console.log(error)
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message || 'Erreur lors de la suppression du produit.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
