import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like, FindOptionsWhere } from 'typeorm'
import { ProductFamily } from './product-family.entity'
import { CreateProductFamilyDto } from './dto/create-product-family.dto'
import { UpdateProductFamilyDto } from './dto/update-product-family.dto'
import { FilterProductFamilyDto } from './dto/filter-product-family.dto'
import { ProductFamilyModel } from 'src/_models/product-family.model'

@Injectable()
export class ProductFamilyService {
  constructor(
    @InjectRepository(ProductFamily)
    private productFamilyRepository: Repository<ProductFamily>
  ) {}

  async create(createProductFamilyDto: CreateProductFamilyDto): Promise<ProductFamilyModel> {
    try {
      const existingFamily = await this.productFamilyRepository.findOne({
        where: { nomFamille: createProductFamilyDto.nomFamille },
      })

      if (existingFamily) {
        throw new HttpException(
          'Une famille de produits avec ce nom existe déjà.',
          HttpStatus.BAD_REQUEST
        )
      }

      const familyEntity = this.productFamilyRepository.create(createProductFamilyDto)
      const family = await this.productFamilyRepository.save(familyEntity)

      return this.toProductFamilyModel(family)
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la création de la famille de produits : ' + error.message,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async findAll(filterDto: FilterProductFamilyDto): Promise<{
    data: ProductFamilyModel[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    try {
      const { page, limit, search, sort, includeArchived } = filterDto
      const skip = (page - 1) * limit

      const where: FindOptionsWhere<ProductFamily> = {}

      if (!includeArchived) {
        where.isArchived = false
      }

      if (search) {
        where.nomFamille = Like(`%${search}%`)
      }

      const [families, total] = await this.productFamilyRepository.findAndCount({
        where,
        skip,
        take: limit,
        order: this.buildSortOrder(sort),
        relations: ['produits'],
      })

      const totalPages = Math.ceil(total / limit)

      return {
        data: families.map((family) => this.toProductFamilyModel(family)),
        total,
        page,
        limit,
        totalPages,
      }
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la récupération des familles de produits : ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async findOne(id: string): Promise<ProductFamilyModel> {
    try {
      const family = await this.productFamilyRepository.findOne({
        where: { idFamille: id },
        relations: ['produits'],
      })

      if (!family) {
        throw new HttpException('Famille de produits non trouvée', HttpStatus.NOT_FOUND)
      }

      return this.toProductFamilyModel(family)
    } catch (error) {
      if (error instanceof HttpException) throw error
      throw new HttpException(
        'Erreur lors de la récupération de la famille de produits : ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async update(
    id: string,
    updateProductFamilyDto: UpdateProductFamilyDto
  ): Promise<ProductFamilyModel> {
    try {
      const family = await this.productFamilyRepository.findOne({
        where: { idFamille: id },
      })

      if (!family) {
        throw new HttpException('Famille de produits non trouvée', HttpStatus.NOT_FOUND)
      }

      if (updateProductFamilyDto.nomFamille) {
        const existingFamily = await this.productFamilyRepository.findOne({
          where: { nomFamille: updateProductFamilyDto.nomFamille },
        })

        if (existingFamily && existingFamily.idFamille !== id) {
          throw new HttpException(
            'Une famille de produits avec ce nom existe déjà.',
            HttpStatus.BAD_REQUEST
          )
        }
      }

      await this.productFamilyRepository.update(id, updateProductFamilyDto)
      const updatedFamily = await this.productFamilyRepository.findOne({
        where: { idFamille: id },
        relations: ['produits'],
      })

      return this.toProductFamilyModel(updatedFamily)
    } catch (error) {
      if (error instanceof HttpException) throw error
      throw new HttpException(
        'Erreur lors de la mise à jour de la famille de produits : ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const family = await this.productFamilyRepository.findOne({
        where: { idFamille: id },
        relations: ['produits'],
      })

      if (!family) {
        throw new HttpException('Famille de produits non trouvée', HttpStatus.NOT_FOUND)
      }

      if (family.produits && family.produits.length > 0) {
        throw new HttpException(
          "Impossible de supprimer cette famille car elle contient des produits. Veuillez d'abord déplacer ou supprimer ces produits.",
          HttpStatus.BAD_REQUEST
        )
      }

      family.isArchived = true
      await this.productFamilyRepository.save(family)

      return 'Famille de produits archivée avec succès'
    } catch (error) {
      if (error instanceof HttpException) throw error
      throw new HttpException(
        'Erreur lors de la suppression de la famille de produits : ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async restore(id: string): Promise<string> {
    try {
      const family = await this.productFamilyRepository.findOne({
        where: { idFamille: id },
      })

      if (!family) {
        throw new HttpException('Famille de produits non trouvée', HttpStatus.NOT_FOUND)
      }

      family.isArchived = false
      await this.productFamilyRepository.save(family)

      return 'Famille de produits restaurée avec succès'
    } catch (error) {
      if (error instanceof HttpException) throw error
      throw new HttpException(
        'Erreur lors de la restauration de la famille de produits : ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  private buildSortOrder(sort?: string): Record<string, 'ASC' | 'DESC'> {
    if (!sort) {
      return { createdAt: 'DESC' }
    }

    const [field, direction] = sort.split(',')
    return { [field]: direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC' }
  }

  private toProductFamilyModel(family: ProductFamily): ProductFamilyModel {
    return {
      idFamille: family.idFamille,
      nomFamille: family.nomFamille,
      description: family.description,
      isArchived: family.isArchived,
      createdAt: family.createdAt,
      updatedAt: family.updatedAt,
      produits: family.produits
        ? family.produits.map((product) => ({
            idProduit: product.idProduit,
            nomProduit: product.nomProduit,
            description: product.description,
            prix: product.prix,
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
          }))
        : undefined,
    }
  }
}
