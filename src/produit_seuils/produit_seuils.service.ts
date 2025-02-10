import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from 'src/product/product.entity'
import { SeuilProduit } from './produit_seuil.entity'
import { CreateSeuilDto } from './dto/create-seuil.dto'
import { UpdateSeuilsDto } from './dto/update-seuil.dto'
import { PaginationDto } from 'src/pagination/pagination.dto'
import StockStatus from 'src/enums/stock-status.enum'

@Injectable()
export class SeuilProduitService {
  constructor(
    @InjectRepository(Product)
    private readonly produitRepository: Repository<Product>,
    @InjectRepository(SeuilProduit)
    private readonly seuilProduitRepository: Repository<SeuilProduit>
  ) {}

  async checkStock(product: Product, quantity: number): Promise<void> {
    try {
      if (
        product.statutStock === StockStatus.OUT_OF_STOCK ||
        product.quantiteDisponible < quantity
      ) {
        throw new HttpException(
          `Stock insuffisant pour le produit ${product.nomProduit}`,
          HttpStatus.BAD_REQUEST
        )
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la vérification du stock',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async updateStock(product: Product, quantity: number): Promise<void> {
    try {
      // ❗ Décrémenter la quantité disponible
      product.quantiteDisponible -= quantity
      await this.produitRepository.save(product)

      // ❗ Récupérer les seuils du produit
      const seuil = await this.findOneSeuil(product.idProduit)

      // ❗ Mettre à jour le statut en fonction de la quantité restante et des seuils
      if (product.quantiteDisponible <= seuil.seuilMinimal) {
        product.statutStock = StockStatus.OUT_OF_STOCK
      } else if (product.quantiteDisponible <= seuil.seuilReapprovisionnement) {
        product.statutStock = StockStatus.BACK_ORDER
      } else {
        product.statutStock = StockStatus.AVAILABLE
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la mise à jour du stock',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async releaseStock(product: Product, quantity: number): Promise<void> {
    try {
      // ❗ Libération du stock disponible
      product.quantiteDisponible += quantity
      await this.produitRepository.save(product)

      // ❗ Récupérer les seuils du produit
      const seuil = await this.findOneSeuil(product.idProduit)

      // ❗ Mettre à jour le statut en fonction de la quantité restante et des seuils
      if (product.quantiteDisponible <= seuil.seuilMinimal) {
        product.statutStock = StockStatus.OUT_OF_STOCK
      } else if (product.quantiteDisponible <= seuil.seuilReapprovisionnement) {
        product.statutStock = StockStatus.BACK_ORDER
      } else {
        product.statutStock = StockStatus.AVAILABLE
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la libération du stock',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  private async findProduitById(productId: string): Promise<Product> {
    const produit = await this.produitRepository.findOne({ where: { idProduit: productId } })
    if (!produit) {
      throw new NotFoundException(`Produit avec l'ID ${productId} non trouvé`)
    }
    return produit
  }

  async createSeuils(
    productId: string,
    createSeuilDto: CreateSeuilDto
  ): Promise<{ message: string }> {
    const { seuilMinimal, seuilReapprovisionnement } = createSeuilDto

    if (seuilMinimal >= seuilReapprovisionnement) {
      throw new BadRequestException(
        'Le seuil minimal doit être inférieur au seuil de réapprovisionnement'
      )
    }

    const produit = await this.findProduitById(productId)

    const seuilExistant = await this.seuilProduitRepository.findOne({ where: { produit } })
    if (seuilExistant) {
      throw new BadRequestException('Les seuils pour ce produit existent déjà')
    }

    const newSeuil = this.seuilProduitRepository.create({
      seuilMinimal,
      seuilReapprovisionnement,
      produit,
    })
    await this.seuilProduitRepository.save(newSeuil)

    return { message: 'Seuils créés avec succès' }
  }

  async updateSeuils(
    productId: string,
    updateSeuilDto: UpdateSeuilsDto
  ): Promise<{ message: string }> {
    const { seuilMinimal, seuilReapprovisionnement } = updateSeuilDto

    if (seuilMinimal >= seuilReapprovisionnement) {
      throw new BadRequestException(
        'Le seuil minimal doit être inférieur au seuil de réapprovisionnement'
      )
    }

    const seuil = await this.seuilProduitRepository.findOne({
      where: { produit: { idProduit: productId } },
      relations: ['produit'],
    })

    if (!seuil) {
      throw new NotFoundException(
        `Les seuils pour le produit avec l'ID ${productId} n'ont pas encore été définis`
      )
    }

    seuil.seuilMinimal = seuilMinimal
    seuil.seuilReapprovisionnement = seuilReapprovisionnement
    await this.seuilProduitRepository.save(seuil)

    return { message: 'Seuils mis à jour avec succès' }
  }

  async findAllSeuils(paginationDto: PaginationDto): Promise<{
    data: SeuilProduit[]
    total: number
    currentPage: number
    totalPages: number
  }> {
    const { page = 1, limit = 10 } = paginationDto

    const offset = (page - 1) * limit

    const [seuils, total] = await this.seuilProduitRepository.findAndCount({
      relations: ['produit'],
      skip: offset,
      take: limit,
    })

    if (!seuils.length) {
      throw new NotFoundException('Aucun seuil trouvé dans la base de données')
    }

    const totalPages = Math.ceil(total / limit)

    return {
      data: seuils,
      total,
      currentPage: page,
      totalPages,
    }
  }

  async findOneSeuil(productId: string): Promise<SeuilProduit> {
    const seuil = await this.seuilProduitRepository.findOne({
      where: { produit: { idProduit: productId } },
      relations: ['produit'],
    })

    if (!seuil) {
      throw new NotFoundException(
        `Les seuils pour le produit avec l'ID ${productId} n'ont pas été définis`
      )
    }

    return seuil
  }

  async deleteSeuil(productId: string): Promise<{ message: string }> {
    const seuil = await this.seuilProduitRepository.findOne({
      where: { produit: { idProduit: productId } },
      relations: ['produit'],
    })

    if (!seuil) {
      throw new NotFoundException(`Aucun seuil défini pour le produit avec l'ID ${productId}`)
    }

    await this.seuilProduitRepository.remove(seuil)

    return { message: 'Seuil supprimé avec succès' }
  }
}
