import { ApiProperty } from '@nestjs/swagger'
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsBoolean,
  ValidateNested,
  IsEnum,
} from 'class-validator'
import { Type } from 'class-transformer'
import { MethodPaiement } from '../../enums/method-paiement.enum'
import SalesUnit from '../../enums/sales-unit.enum'

export class ProduitOrderedDto {
  @ApiProperty({
    example: 'dd078d34-49bb-43a4-aa8e-b6bf624abea3',
    description: "L'ID du produit",
  })
  @IsUUID()
  readonly idProduit: string

  @ApiProperty({
    example: 'RPET Flakes Clear',
    description: 'Le nom du produit',
  })
  @IsString()
  @IsOptional()
  readonly nomProduit?: string

  @ApiProperty({
    example: 'Recycled PET flakes, clear color, suitable for food packaging',
    description: 'La description du produit',
  })
  @IsString()
  @IsOptional()
  readonly description?: string

  @ApiProperty({
    example: '1200',
    description: 'Le prix du produit',
  })
  @IsString()
  @IsOptional()
  readonly prix?: string

  @ApiProperty({
    example: 5000,
    description: 'La quantité disponible',
  })
  @IsNumber()
  @IsOptional()
  readonly quantiteDisponible?: number

  @ApiProperty({
    example: 'ACTIF',
    description: 'Le statut du produit',
  })
  @IsString()
  @IsOptional()
  readonly statut?: string

  @ApiProperty({
    example: 'Disponible',
    description: 'Le statut du stock',
  })
  @IsString()
  @IsOptional()
  readonly statusStock?: string

  @ApiProperty({
    example: '2025-03-05T06:18:25.996Z',
    description: 'Date de création',
  })
  @IsString()
  @IsOptional()
  readonly createdAt?: string

  @ApiProperty({
    example: '2025-03-05T06:18:25.996Z',
    description: 'Date de mise à jour',
  })
  @IsString()
  @IsOptional()
  readonly updatedAt?: string

  @ApiProperty({
    example: 'RPET-FL-CLR-001',
    description: 'Le SKU du produit',
  })
  @IsString()
  @IsOptional()
  readonly sku?: string

  @ApiProperty({
    example: 1,
    description: 'Le poids du produit',
  })
  @IsNumber()
  @IsOptional()
  readonly poids?: number

  @ApiProperty({
    example: 'https://picsum.photos/seed/rpet-flakes/800/600.webp',
    description: "L'URL de l'image du produit",
  })
  @IsString()
  @IsOptional()
  readonly urlImage?: string

  @ApiProperty({
    example: '4.5',
    description: "L'évaluation du produit",
  })
  @IsString()
  @IsOptional()
  readonly evaluation?: string

  @ApiProperty({
    example: 150,
    description: 'Le nombre de produits vendus',
  })
  @IsNumber()
  @IsOptional()
  readonly nombreVendu?: number

  @ApiProperty({
    example: '1450',
    description: 'Le prix de vente du produit',
  })
  @IsString()
  @IsOptional()
  readonly prixVente?: string

  @ApiProperty({
    example: '950',
    description: "Le prix d'achat du produit",
  })
  @IsString()
  @IsOptional()
  readonly prixAchat?: string

  @ApiProperty({
    example: '20',
    description: 'Le taux de TVA du produit',
  })
  @IsString()
  @IsOptional()
  readonly tauxTVA?: string

  @ApiProperty({
    example: true,
    description: 'Indique si la taxe est activée pour ce produit',
  })
  @IsBoolean()
  @IsOptional()
  readonly taxeActivee?: boolean

  @ApiProperty({
    example: '25.5',
    description: 'La hauteur du produit',
  })
  @IsString()
  @IsOptional()
  readonly hauteur?: string

  @ApiProperty({
    example: '30',
    description: 'La largeur du produit',
  })
  @IsString()
  @IsOptional()
  readonly largeur?: string

  @ApiProperty({
    example: '40',
    description: 'La longueur du produit',
  })
  @IsString()
  @IsOptional()
  readonly longueur?: string

  @ApiProperty({
    example: '12000',
    description: 'Le prix du produit à la palette',
  })
  @IsString()
  @IsOptional()
  readonly prixPalette?: string

  @ApiProperty({
    example: '120000',
    description: 'Le prix du produit au container',
  })
  @IsString()
  @IsOptional()
  readonly prixContainer?: string
}

export class LigneItemOrderedDto {
  @ApiProperty({
    type: ProduitOrderedDto,
    description: 'Le produit associé à cette ligne',
  })
  @ValidateNested()
  @Type(() => ProduitOrderedDto)
  readonly produit: ProduitOrderedDto

  @ApiProperty({
    example: 2,
    description: 'La quantité commandée',
  })
  @IsNumber()
  readonly quantite: number

  @ApiProperty({
    example: SalesUnit.PALETTE,
    description: "L'unité de vente (PALETTE ou CONTAINER)",
    enum: SalesUnit,
  })
  @IsEnum(SalesUnit)
  readonly uniteVente: SalesUnit

  @ApiProperty({
    example: 'active',
    description: 'Le statut de la ligne',
  })
  @IsString()
  readonly statut: string

  @ApiProperty({
    example: 2416.666666666667,
    description: 'Le total HT de la ligne',
  })
  @IsNumber()
  readonly totalHt: number

  @ApiProperty({
    example: 483.33333333333303,
    description: 'Le total des taxes de la ligne',
  })
  @IsNumber()
  readonly totalTax: number

  @ApiProperty({
    example: 2900,
    description: 'Le total TTC de la ligne',
  })
  @IsNumber()
  readonly totalTtc: number
}

export class CommandeOrderedDto {
  @ApiProperty({
    example: 'fb3fea98-ce12-43b5-9560-ead1669ba50b',
    description: "L'ID du client",
  })
  @IsUUID()
  readonly client: string

  @ApiProperty({
    example: '53c3e094-61dd-428f-91cf-466f249d5631',
    description: "L'ID de l'utilisateur",
  })
  @IsUUID()
  readonly utilisateur: string

  @ApiProperty({
    example: '2025-03-08',
    description: 'La date de livraison prévue',
  })
  @IsString()
  readonly dateLivraisonPrevue: string

  @ApiProperty({
    example: 'VIREMENT',
    description: 'La méthode de paiement (VIREMENT ou CHEQUE)',
    enum: MethodPaiement,
  })
  @IsString()
  readonly methodePaiement: MethodPaiement

  @ApiProperty({
    type: [LigneItemOrderedDto],
    description: 'Les articles de la commande',
  })
  @ValidateNested({ each: true })
  @Type(() => LigneItemOrderedDto)
  readonly ligneItems: LigneItemOrderedDto[]

  @ApiProperty({
    example: 2416.666666666667,
    description: 'Le total HT de la commande',
  })
  @IsNumber()
  readonly totalHt: number

  @ApiProperty({
    example: 483.33333333333303,
    description: 'Le total des taxes de la commande',
  })
  @IsNumber()
  readonly totalTaxe: number

  @ApiProperty({
    example: 2900,
    description: 'Le total TTC de la commande',
  })
  @IsNumber()
  readonly totalTtc: number
}
