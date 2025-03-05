import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from './product.entity'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { FilterProductDto } from './dto/filter-product.dto'
import { ProductModel } from 'src/_models/product.model'
import { HttpException, HttpStatus } from '@nestjs/common'
import { SeuilProduitService } from 'src/produit_seuils/produit_seuils.service'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly seuilService: SeuilProduitService
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductModel> {
    try {
      const existingProduct = await this.productRepository.findOne({
        where: { sku: createProductDto.sku },
      })

      if (existingProduct) {
        throw new HttpException('Un produit avec ce SKU existe déjà.', HttpStatus.BAD_REQUEST)
      }

      const productEntity = this.productRepository.create(createProductDto)
      const product = await this.productRepository.save(productEntity)

      // ❗Création des seuils pour le produit par défaut (1,3) :
      const createSeuilDto = {
        seuilMinimal: 1,
        seuilReapprovisionnement: 3,
      }
      try {
        await this.seuilService.createSeuils(product.idProduit, createSeuilDto)
      } catch (error) {
        throw new HttpException(
          error.message || 'Erreur lors de la création des seuils du produit.',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }

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
        includeArchived = false,
      } = filterDto

      // Create query builder
      const queryBuilder = this.productRepository.createQueryBuilder('product')

      // N'incluez pas les produits archivés par défaut
      if (!includeArchived) {
        queryBuilder.andWhere('product.isArchived = :isArchived', { isArchived: false })
      }

      // Apply search filter
      if (search) {
        queryBuilder.andWhere(
          '(LOWER(product.nomProduit) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search))',
          { search: `%${search}%` }
        )
      }

      // Apply price filters
      if (prixMin !== undefined) {
        queryBuilder.andWhere('product.prix >= :prixMin', { prixMin })
      }

      if (prixMax !== undefined) {
        queryBuilder.andWhere('product.prix <= :prixMax', { prixMax })
      }

      // Apply status filter
      if (statut) {
        queryBuilder.andWhere('product.statut = :statut', { statut })
      }

      // Apply stock status filter
      if (statutStock) {
        queryBuilder.andWhere('product.statutStock = :statutStock', { statutStock })
      }

      // Apply sorting
      if (sort) {
        const [field, direction] = sort.split(',')
        const validSortFields = ['createdAt', 'prix', 'nombreVendu', 'evaluation']

        if (validSortFields.includes(field)) {
          queryBuilder.orderBy(`product.${field}`, direction.toUpperCase() as 'ASC' | 'DESC')
        } else {
          // Default sorting if invalid field
          queryBuilder.orderBy('product.createdAt', 'DESC')
        }
      } else {
        // Default sorting
        queryBuilder.orderBy('product.createdAt', 'DESC')
      }

      // Apply pagination
      queryBuilder.skip((page - 1) * limit)
      queryBuilder.take(limit)

      // Execute query
      const [result, total] = await queryBuilder.getManyAndCount()
      const totalPages = Math.ceil(total / limit)

      return {
        data: result.map((product) => this.toProductModel(product)),
        total,
        page,
        limit,
        totalPages,
      }
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la récupération des produits: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async findOne(id: string): Promise<ProductModel> {
    try {
      const product = await this.productRepository.findOneOrFail({ where: { idProduit: id } })
      return this.toProductModel(product)
    } catch (error) {
      throw new HttpException('Produit non trouvé.' + error.message, HttpStatus.NOT_FOUND)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductModel> {
    try {
      await this.productRepository.update(id, updateProductDto)
      const updatedProduct = await this.productRepository.findOneOrFail({
        where: { idProduit: id },
      })
      return this.toProductModel(updatedProduct)
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la mise à jour du produit.' + error.message,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const product = await this.productRepository.findOne({ where: { idProduit: id } })

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
        "Erreur inattendue lors de l'archivage du produit." + error.message,
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
      const product = await this.productRepository.findOne({ where: { idProduit: id } })

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
        'Erreur inattendue lors de la restauration du produit.' + error.message,
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

  private toProductModel(product: Product): ProductModel {
    return {
      idProduit: product.idProduit,
      nomProduit: product.nomProduit,
      description: product.description,
      prix: product.prix,
      quantiteDisponible: product.quantiteDisponible,
      statut: product.statut,
      statusStock: product.statutStock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
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
    }
  }
}
