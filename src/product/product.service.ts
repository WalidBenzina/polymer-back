import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from './product.entity'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { PaginationDto } from 'src/pagination/pagination.dto'
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

  async findAll(paginationDto: PaginationDto): Promise<{
    data: ProductModel[]
    total: number
    currentPage: number
    totalPages: number
  }> {
    try {
      const { page, limit } = paginationDto

      const [result, total] = await this.productRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      })

      const totalPages = Math.ceil(total / limit)

      return {
        data: result.map((product) => this.toProductModel(product)),
        total: total,
        currentPage: page,
        totalPages: totalPages,
      }
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la récupération des produits.',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async findOne(id: string): Promise<ProductModel> {
    try {
      const product = await this.productRepository.findOneOrFail({ where: { idProduit: id } })
      return this.toProductModel(product)
    } catch (error) {
      throw new HttpException('Produit non trouvé.', HttpStatus.NOT_FOUND)
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
      throw new HttpException('Erreur lors de la mise à jour du produit.', HttpStatus.BAD_REQUEST)
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const product = await this.productRepository.findOne({ where: { idProduit: id } })

      if (!product) {
        throw new HttpException('Produit non trouvé.', HttpStatus.NOT_FOUND)
      }

      const result = await this.productRepository.delete(id)

      if (result.affected === 0) {
        throw new HttpException(
          'Échec de la suppression du produit.',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }

      return `Produit avec l'ID ${id} supprimé avec succès.`
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(
        'Erreur inattendue lors de la suppression du produit.',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
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
    }
  }
}
