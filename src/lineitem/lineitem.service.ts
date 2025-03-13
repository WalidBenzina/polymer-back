import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LineItem } from './lineitem.entity'
import { Product } from '../product/product.entity'
import { LineItemOrderedDto } from '../commande/dto/line-items-ordered.dto'
import { LineItemStatus } from '../enums/line-item-status.enum'
import SalesUnit from '../enums/sales-unit.enum'

@Injectable()
export class LineItemService {
  constructor(
    @InjectRepository(LineItem)
    private lineItemRepository: Repository<LineItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async createLineItem(item: LineItemOrderedDto, commandeId: string): Promise<LineItem> {
    const product = await this.productRepository.findOne({
      where: { idProduit: item.produit.idProduit },
    })

    // Convert string status to enum
    let itemStatus: LineItemStatus
    switch (item.statut.toLowerCase()) {
      case 'active':
        itemStatus = LineItemStatus.ACTIVE
        break
      case 'inactive':
        itemStatus = LineItemStatus.INACTIVE
        break
      case 'pending':
        itemStatus = LineItemStatus.PENDING
        break
      case 'completed':
        itemStatus = LineItemStatus.COMPLETED
        break
      default:
        itemStatus = LineItemStatus.ACTIVE // Default to active if unknown status
    }

    const lineItem = this.lineItemRepository.create({
      produit: product,
      commande: { idCommande: commandeId },
      quantite: item.quantite,
      uniteVente: item.uniteVente || SalesUnit.KG, // Default to KG if not specified
      poidsTotal: item.poidsTotal,
      prixUnitaire: item.prixUnitaire || product.prix, // Use product price if not specified
      totalHt: item.totalHt,
      totalTax: item.totalTax,
      totalTtc: item.totalTtc,
      statut: itemStatus,
    })

    return this.lineItemRepository.save(lineItem)
  }
}
