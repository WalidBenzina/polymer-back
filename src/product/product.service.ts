import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  Repository,
  Like,
  MoreThanOrEqual,
  Between,
  LessThanOrEqual,
  FindOptionsWhere,
} from 'typeorm'
import { Product } from './product.entity'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { FilterProductDto } from './dto/filter-product.dto'
import { ProductModel } from 'src/_models/product.model'
import { HttpException, HttpStatus } from '@nestjs/common'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductModel> {
    try {
      const existingProduct = await this.productRepository.findOne({
        where: { sku: createProductDto.sku },
      })

      if (existingProduct) {
        throw new HttpException('Un produit avec ce SKU existe déjà.', HttpStatus.BAD_REQUEST)
      }

      // Set default values for palette and container prices if not provided
      if (!createProductDto.prixPalette) {
        createProductDto.prixPalette = createProductDto.prix * 10 // Default: 10x the base price
      }

      if (!createProductDto.prixContainer) {
        createProductDto.prixContainer = createProductDto.prix * 100 // Default: 100x the base price
      }

      const productEntity = this.productRepository.create(createProductDto)
      const product = await this.productRepository.save(productEntity)

      return this.toProductModel(product)
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la création du produit : ' + error.message,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async findAll(filterDto: FilterProductDto): Promise<{
    data: ProductModel[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    try {
      const {
        page,
        limit,
        search,
        prixMin,
        prixMax,
        statut,
        statutStock,
        sort,
        includeArchived,
        idFamille,
      } = filterDto
      const skip = (page - 1) * limit

      const where: FindOptionsWhere<Product> = {}

      if (!includeArchived) {
        where.isArchived = false
      }

      if (search) {
        where.nomProduit = Like(`%${search}%`)
      }

      if (prixMin !== undefined) {
        where.prix = MoreThanOrEqual(prixMin)
      }

      if (prixMax !== undefined) {
        if (where.prix) {
          where.prix = Between(prixMin, prixMax)
        } else {
          where.prix = LessThanOrEqual(prixMax)
        }
      }

      if (statut) {
        where.statut = statut
      }

      if (statutStock) {
        where.statutStock = statutStock
      }

      if (idFamille) {
        where.idFamille = idFamille
      }

      const [products, total] = await this.productRepository.findAndCount({
        where,
        skip,
        take: limit,
        order: this.buildSortOrder(sort),
        relations: ['famille'],
      })

      const totalPages = Math.ceil(total / limit)

      return {
        data: products.map((product) => this.toProductModel(product)),
        total,
        page,
        limit,
        totalPages,
      }
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la récupération des produits : ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async findOne(id: string): Promise<ProductModel> {
    try {
      const product = await this.productRepository.findOne({
        where: { idProduit: id },
        relations: ['famille'],
      })

      if (!product) {
        throw new HttpException('Produit non trouvé', HttpStatus.NOT_FOUND)
      }

      return this.toProductModel(product)
    } catch (error) {
      if (error instanceof HttpException) throw error
      throw new HttpException(
        'Erreur lors de la récupération du produit : ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductModel> {
    try {
      await this.productRepository.update(id, updateProductDto)
      const updatedProduct = await this.productRepository.findOne({
        where: { idProduit: id },
        relations: ['famille'],
      })

      if (!updatedProduct) {
        throw new HttpException('Produit non trouvé', HttpStatus.NOT_FOUND)
      }

      return this.toProductModel(updatedProduct)
    } catch (error) {
      if (error instanceof HttpException) throw error
      throw new HttpException(
        'Erreur lors de la mise à jour du produit : ' + error.message,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const product = await this.productRepository.findOne({
        where: { idProduit: id },
        relations: ['famille'],
      })

      if (!product) {
        throw new HttpException('Produit non trouvé.', HttpStatus.NOT_FOUND)
      }

      // Au lieu de vérifier et bloquer la suppression, marquez simplement le produit comme archivé
      await this.productRepository.update(id, { isArchived: true })

      return `Produit avec l'ID ${id} archivé avec succès.`
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(
        "Erreur inattendue lors de l'archivage du produit : " + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  /**
   * Restaure un produit archivé
   * @param id L'ID du produit à restaurer
   * @returns Un message de confirmation
   */
  async restore(id: string): Promise<string> {
    try {
      const product = await this.productRepository.findOne({
        where: { idProduit: id },
        relations: ['famille'],
      })

      if (!product) {
        throw new HttpException('Produit non trouvé.', HttpStatus.NOT_FOUND)
      }

      if (!product.isArchived) {
        return `Le produit avec l'ID ${id} n'est pas archivé.`
      }

      await this.productRepository.update(id, { isArchived: false })

      return `Produit avec l'ID ${id} restauré avec succès.`
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(
        'Erreur inattendue lors de la restauration du produit : ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  /**
   * Check if a product is used in any line items
   * @param productId The ID of the product to check
   * @returns The number of line items using this product
   */
  private async checkProductUsageInLineItems(productId: string): Promise<number> {
    const query = `
      SELECT COUNT(*) as count 
      FROM line_items 
      WHERE produit_id = $1
    `

    const result = await this.productRepository.query(query, [productId])
    return parseInt(result[0].count, 10)
  }

  private buildSortOrder(sort?: string): Record<string, 'ASC' | 'DESC'> {
    if (!sort) {
      return { createdAt: 'DESC' }
    }

    const [field, direction] = sort.split(',')
    const validSortFields = ['createdAt', 'prix', 'nombreVendu', 'evaluation', 'nomProduit']

    if (validSortFields.includes(field)) {
      return { [field]: direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC' }
    }

    return { createdAt: 'DESC' }
  }

  private toProductModel(product: Product): ProductModel {
    return {
      idProduit: product.idProduit,
      nomProduit: product.nomProduit,
      description: product.description,
      prix: product.prix,
      prixPalette: product.prixPalette || product.prix * 10, // Default if not set
      prixContainer: product.prixContainer || product.prix * 100, // Default if not set
      quantiteDisponible: product.quantiteDisponible,
      statut: product.statut,
      statusStock: product.statutStock,
      sku: product.sku,
      poids: product.poids,
      urlImage: product.urlImage,
      evaluation: product.evaluation,
      nombreVendu: product.nombreVendu,
      prixVente: product.prixVente,
      prixAchat: product.prixAchat,
      tauxTVA: product.tauxTVA,
      taxeActivee: product.taxeActivee,
      hauteur: product.hauteur,
      largeur: product.largeur,
      longueur: product.longueur,
      isArchived: product.isArchived,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      idFamille: product.idFamille,
      famille: product.famille
        ? {
            idFamille: product.famille.idFamille,
            nomFamille: product.famille.nomFamille,
            description: product.famille.description,
            isArchived: product.famille.isArchived,
            createdAt: product.famille.createdAt,
            updatedAt: product.famille.updatedAt,
          }
        : undefined,
    }
  }
}
