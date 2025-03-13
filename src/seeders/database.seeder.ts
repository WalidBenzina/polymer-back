import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { Role } from '../role/role.entity'
import { RoleStatus } from '../enums/role-status.enum'
import { PermissionType } from '../common/types/permissions.type'
import { User } from '../user/user.entity'
import { Client } from '../client/client.entity'
import { Product } from '../product/product.entity'
import { ProductFamily } from '../product-family/product-family.entity'
import { Commande } from '../commande/commande.entity'
import { UserStatus } from '../enums/user-status.enum'
import { ClientStatus } from '../enums/client-status.enum'
import ProductStatus from '../enums/product-status.enum'
import StockStatus from '../enums/stock-status.enum'
import { CommandeStatus } from '../enums/commande-status.enum'
import * as bcrypt from 'bcrypt'
import { Paiement } from '../paiement/paiement.entity'
import { MethodPaiement } from '../enums/method-paiement.enum'
import { PaiementStatus } from '../enums/paiement-status.enum'
import { LineItemStatus } from '../enums/line-item-status.enum'
import { LineItem } from '../lineitem/lineitem.entity'
import SalesUnit, { SalesUnitWeight } from '../enums/sales-unit.enum'

export const RoleUUIDs = {
  ADMIN: '',
  CLIENT: '',
  BACKOFFICE: '',
}

@Injectable()
export class DatabaseSeeder {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductFamily)
    private readonly productFamilyRepository: Repository<ProductFamily>,
    @InjectRepository(Commande)
    private readonly commandeRepository: Repository<Commande>,
    @InjectRepository(Paiement)
    private readonly paiementRepository: Repository<Paiement>,
    private readonly dataSource: DataSource
  ) {}

  async seed(): Promise<void> {
    console.log('🌱 Starting database seeding...')
    console.log('🌱 NODE_ENV:', process.env.NODE_ENV)

    try {
      await this.clearDatabase()
      console.log('✅ Database cleared')

      await this.createExtensions()
      console.log('✅ Extensions created')

      await this.seedRoles()
      console.log('✅ Roles seeded')

      await this.seedProductFamilies()
      console.log('✅ Product families seeded')

      await this.seedProducts()
      console.log('✅ Products seeded')

      const clients = await this.seedClients()
      console.log('✅ Clients seeded')

      await this.seedUsers(clients)
      console.log('✅ Users seeded')

      try {
        await this.seedOrders(clients)
        console.log('✅ Orders seeded')
      } catch (orderError) {
        console.error('⚠️ Error seeding orders, but continuing with other operations:', orderError)
      }

      console.log('✅ Database seeding completed successfully')
    } catch (error) {
      console.error('❌ Error seeding database:', error)
      throw new Error(`Failed to seed database: ${error.message}`)
    }
  }

  private async clearDatabase(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()

    try {
      // Disable foreign key checks
      await queryRunner.query('SET CONSTRAINTS ALL DEFERRED')

      // Get all table names from the current schema
      const tables = await queryRunner.query(`
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename != 'typeorm_metadata'
      `)

      // Truncate all tables in a single transaction
      await queryRunner.startTransaction()

      for (const { tablename } of tables) {
        await queryRunner.query(`TRUNCATE TABLE "${tablename}" CASCADE`)
      }

      await queryRunner.commitTransaction()

      // Re-enable foreign key checks
      await queryRunner.query('SET CONSTRAINTS ALL IMMEDIATE')

      console.log('✅ Database cleared successfully')
    } catch (error) {
      console.error('❌ Error clearing database:', error)
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  private async seedRoles(): Promise<void> {
    const roles = [
      {
        nomRole: 'Admin',
        permissions: [PermissionType.ALL],
        status: RoleStatus.ACTIVE,
      },
      {
        nomRole: 'Client',
        permissions: [
          PermissionType.READ_PRODUCT,
          PermissionType.READ_ORDER,
          PermissionType.CREATE_ORDER,
          PermissionType.DELETE_ORDER,
          PermissionType.UPDATE_ORDER,
          PermissionType.READ_DOCUMENT,
          PermissionType.CREATE_DOCUMENT,
          PermissionType.DELETE_DOCUMENT,
          PermissionType.UPDATE_DOCUMENT,
          PermissionType.READ_PRICE_OFFER,
          PermissionType.CREATE_PAYMENT,
          PermissionType.UPDATE_PAYMENT,
          PermissionType.DELETE_PAYMENT,
        ],
        status: RoleStatus.ACTIVE,
      },
      {
        nomRole: 'Backoffice',
        permissions: [PermissionType.ALL],
        status: RoleStatus.ACTIVE,
      },
    ]

    for (const roleData of roles) {
      const existingRole = await this.roleRepository.findOneBy({ nomRole: roleData.nomRole })

      if (!existingRole) {
        const newRole = this.roleRepository.create({
          nomRole: roleData.nomRole,
          permissions: roleData.permissions,
          statut: roleData.status,
        })

        const savedRole = await this.roleRepository.save(newRole)
        RoleUUIDs[roleData.nomRole.toUpperCase()] = savedRole.idRole
      } else {
        RoleUUIDs[roleData.nomRole.toUpperCase()] = existingRole.idRole
      }
    }
  }

  private async seedProductFamilies(): Promise<void> {
    const productFamilies = [
      {
        nomFamille: 'RPET',
        description: 'Recycled PET flakes, clear color, suitable for food packaging',
      },
      {
        nomFamille: 'HDPE',
        description: 'High-density polyethylene regrind from post-consumer waste',
      },
      {
        nomFamille: 'PP',
        description: 'Recycled polypropylene pellets for injection molding.webp',
      },
      {
        nomFamille: 'LDPE',
        description: 'Low-density polyethylene resin from recycled materials',
      },
      {
        nomFamille: 'PVC',
        description: 'Polyvinyl chloride recyclé pour applications industrielles',
      },
      {
        nomFamille: 'ABS',
        description: 'Acrylonitrile butadiène styrène recyclé pour moulage',
      },
      {
        nomFamille: 'PS',
        description: 'Polystyrène recyclé pour emballages',
      },
      {
        nomFamille: 'PC',
        description: 'Polycarbonate recyclé haute qualité',
      },
      {
        nomFamille: 'PA',
        description: 'Polyamide recyclé pour applications techniques',
      },
      {
        nomFamille: 'PET',
        description: 'Polyéthylène téréphtalate recyclé pour bouteilles',
      },
    ]

    for (const familyData of productFamilies) {
      const existingFamily = await this.productFamilyRepository.findOneBy({
        nomFamille: familyData.nomFamille,
      })

      if (!existingFamily) {
        const newFamily = this.productFamilyRepository.create(familyData)
        await this.productFamilyRepository.save(newFamily)
      }
    }
  }

  private async seedProducts(): Promise<Product[]> {
    // First, get all product families
    const productFamilies = await this.productFamilyRepository.find()
    const familyMap = new Map<string, ProductFamily>()

    // Create a map of family names to family objects for easy lookup
    productFamilies.forEach((family) => {
      familyMap.set(family.nomFamille, family)
    })

    const products = [
      {
        nomProduit: 'RPET Flakes Clear',
        description: 'Recycled PET flakes, clear color, suitable for food packaging',
        prix: 1.2,
        prixAchat: 0.95,
        quantiteDisponible: 500000,
        statut: ProductStatus.ACTIF,
        statutStock: StockStatus.DISPONIBLE,
        sku: 'RPET-FL-CLR-001',
        urlImage: 'https://picsum.photos/seed/rpet-flakes/800/600.webp',
        evaluation: 4.5,
        nombreVendu: 150,
        tauxTVA: 20.0,
        taxeActivee: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        familyName: 'RPET',
      },
      {
        nomProduit: 'HDPE Regrind',
        description: 'High-density polyethylene regrind from post-consumer waste',
        prix: 0.8,
        prixAchat: 0.6,
        quantiteDisponible: 300000,
        statut: ProductStatus.ACTIF,
        statutStock: StockStatus.DISPONIBLE,
        sku: 'HDPE-RG-001',
        urlImage: 'https://picsum.photos/seed/hdpe-regrind/800/600.webp',
        evaluation: 4.2,
        nombreVendu: 220,
        tauxTVA: 20.0,
        taxeActivee: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        familyName: 'HDPE',
      },
      {
        nomProduit: 'PP Pellets Recycled',
        description: 'Recycled polypropylene pellets for injection molding.webp',
        prix: 0.95,
        prixAchat: 0.75,
        quantiteDisponible: 400000,
        statut: ProductStatus.ACTIF,
        statutStock: StockStatus.DISPONIBLE,
        sku: 'PP-PL-REC-001',
        urlImage: 'https://picsum.photos/seed/pp-pellets/800/600.webp',
        evaluation: 4.3,
        nombreVendu: 180,
        tauxTVA: 20.0,
        taxeActivee: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        familyName: 'PP',
      },
      {
        nomProduit: 'LDPE Resin Recycled',
        description: 'Low-density polyethylene resin from recycled materials',
        prix: 0.85,
        prixAchat: 0.65,
        quantiteDisponible: 250000,
        statut: ProductStatus.ACTIF,
        statutStock: StockStatus.DISPONIBLE,
        sku: 'LDPE-RS-REC-001',
        urlImage: 'https://picsum.photos/seed/ldpe-resin/800/600.webp',
        evaluation: 4.0,
        nombreVendu: 130,
        tauxTVA: 20.0,
        taxeActivee: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        familyName: 'LDPE',
      },
      {
        nomProduit: 'PVC Recyclé',
        description: 'Polyvinyl chloride recyclé pour applications industrielles',
        prix: 1.1,
        prixAchat: 0.85,
        quantiteDisponible: 200000,
        statut: ProductStatus.ACTIF,
        statutStock: StockStatus.DISPONIBLE,
        sku: 'PVC-REC-001',
        urlImage: 'https://picsum.photos/seed/pvc-recycle/800/600.webp',
        evaluation: 4.1,
        nombreVendu: 160,
        tauxTVA: 20.0,
        taxeActivee: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        familyName: 'PVC',
      },
      {
        nomProduit: 'ABS Recyclé',
        description: 'Acrylonitrile butadiène styrène recyclé pour moulage',
        prix: 1.3,
        prixAchat: 1.05,
        quantiteDisponible: 150000,
        statut: ProductStatus.ACTIF,
        statutStock: StockStatus.DISPONIBLE,
        sku: 'ABS-REC-001',
        urlImage: 'https://picsum.photos/seed/abs-recycle/800/600.webp',
        evaluation: 4.4,
        nombreVendu: 140,
        tauxTVA: 20.0,
        taxeActivee: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        familyName: 'ABS',
      },
      {
        nomProduit: 'PS Recyclé',
        description: 'Polystyrène recyclé pour emballages',
        prix: 0.9,
        prixAchat: 0.7,
        quantiteDisponible: 350000,
        statut: ProductStatus.ACTIF,
        statutStock: StockStatus.DISPONIBLE,
        sku: 'PS-REC-001',
        urlImage: 'https://picsum.photos/seed/ps-recycle/800/600.webp',
        evaluation: 4.2,
        nombreVendu: 170,
        tauxTVA: 20.0,
        taxeActivee: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        familyName: 'PS',
      },
      {
        nomProduit: 'PC Recyclé',
        description: 'Polycarbonate recyclé haute qualité',
        prix: 1.5,
        prixAchat: 1.2,
        quantiteDisponible: 100000,
        statut: ProductStatus.ACTIF,
        statutStock: StockStatus.DISPONIBLE,
        sku: 'PC-REC-001',
        urlImage: 'https://picsum.photos/seed/pc-recycle/800/600.webp',
        evaluation: 4.6,
        nombreVendu: 120,
        tauxTVA: 20.0,
        taxeActivee: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        familyName: 'PC',
      },
      {
        nomProduit: 'PA Recyclé',
        description: 'Polyamide recyclé pour applications techniques',
        prix: 1.4,
        prixAchat: 1.1,
        quantiteDisponible: 120000,
        statut: ProductStatus.ACTIF,
        statutStock: StockStatus.DISPONIBLE,
        sku: 'PA-REC-001',
        urlImage: 'https://picsum.photos/seed/pa-recycle/800/600.webp',
        evaluation: 4.3,
        nombreVendu: 110,
        tauxTVA: 20.0,
        taxeActivee: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        familyName: 'PA',
      },
      {
        nomProduit: 'PET Recyclé',
        description: 'Polyéthylène téréphtalate recyclé pour bouteilles',
        prix: 1.0,
        prixAchat: 0.8,
        quantiteDisponible: 450000,
        statut: ProductStatus.ACTIF,
        statutStock: StockStatus.DISPONIBLE,
        sku: 'PET-REC-001',
        urlImage: 'https://picsum.photos/seed/pet-recycle/800/600.webp',
        evaluation: 4.5,
        nombreVendu: 200,
        tauxTVA: 20.0,
        taxeActivee: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        familyName: 'PET',
      },
    ]

    const savedProducts: Product[] = []
    for (const productData of products) {
      const existingProduct = await this.productRepository.findOneBy({ sku: productData.sku })
      if (!existingProduct) {
        // Get the family for this product
        const family = familyMap.get(productData.familyName)

        if (!family) {
          console.warn(
            `Family ${productData.familyName} not found for product ${productData.nomProduit}, skipping...`
          )
          continue
        }

        // Create a new product object without the familyName property
        const productToSave = {
          ...Object.fromEntries(
            Object.entries(productData).filter(([key]) => key !== 'familyName')
          ),
          idFamille: family.idFamille,
          famille: family,
        }

        const savedProduct = await this.productRepository.save(
          this.productRepository.create(productToSave)
        )
        savedProducts.push(savedProduct)
      } else {
        savedProducts.push(existingProduct)
      }
    }
    return savedProducts
  }

  private async seedClients(): Promise<Client[]> {
    const clients = [
      {
        nomClient: 'EcoPlast Industries',
        email: 'contact@ecoplast.com',
        adresse: '123 Rue du Recyclage, 75001 Paris',
        telephone: '0123456789',
        statut: ClientStatus.ACTIVE,
      },
      {
        nomClient: 'GreenPolymers SARL',
        email: 'info@greenpolymers.fr',
        adresse: "456 Avenue de l'Innovation, 69002 Lyon",
        telephone: '0987654321',
        statut: ClientStatus.ACTIVE,
      },
      {
        nomClient: 'RecycTech Solutions',
        email: 'contact@recyctech.fr',
        adresse: '789 Boulevard Circulaire, 33000 Bordeaux',
        telephone: '0567891234',
        statut: ClientStatus.ACTIVE,
      },
      {
        nomClient: 'Bio-Polymères & Co',
        email: 'info@biopolymeres.fr',
        adresse: '321 Rue Écologique, 59000 Lille',
        telephone: '0345678912',
        statut: ClientStatus.ACTIVE,
      },
      {
        nomClient: 'CircularPlast',
        email: 'contact@circularplast.fr',
        adresse: '654 Avenue Durable, 44000 Nantes',
        telephone: '0789123456',
        statut: ClientStatus.ACTIVE,
      },
    ]

    const savedClients: Client[] = []
    for (const clientData of clients) {
      const existingClient = await this.clientRepository.findOneBy({ email: clientData.email })
      if (!existingClient) {
        const savedClient = await this.clientRepository.save(
          this.clientRepository.create(clientData)
        )
        savedClients.push(savedClient)
      } else {
        savedClients.push(existingClient)
      }
    }
    return savedClients
  }

  private async seedUsers(clients: Client[]): Promise<void> {
    const users = [
      {
        nomUtilisateur: 'Admin Principal',
        email: 'admin@polymer.fr',
        motDePasse: 'admin123',
        role: { idRole: RoleUUIDs.ADMIN },
        statut: UserStatus.ACTIVE,
      },
      {
        nomUtilisateur: 'Back Office 1',
        email: 'backoffice1@polymer.fr',
        motDePasse: 'back123',
        role: { idRole: RoleUUIDs.BACKOFFICE },
        statut: UserStatus.ACTIVE,
      },
      {
        nomUtilisateur: 'Back Office 2',
        email: 'backoffice2@polymer.fr',
        motDePasse: 'back456',
        role: { idRole: RoleUUIDs.BACKOFFICE },
        statut: UserStatus.ACTIVE,
      },
      {
        nomUtilisateur: 'EcoPlast Client',
        email: 'client@ecoplast.com',
        motDePasse: 'eco123',
        role: { idRole: RoleUUIDs.CLIENT },
        idClient: clients[0],
        statut: UserStatus.ACTIVE,
      },
      {
        nomUtilisateur: 'GreenPolymers Client',
        email: 'client@greenpolymers.fr',
        motDePasse: 'green123',
        role: { idRole: RoleUUIDs.CLIENT },
        idClient: clients[1],
        statut: UserStatus.ACTIVE,
      },
      {
        nomUtilisateur: 'RecycTech Client',
        email: 'client@recyctech.fr',
        motDePasse: 'recyc123',
        role: { idRole: RoleUUIDs.CLIENT },
        idClient: clients[2],
        statut: UserStatus.ACTIVE,
      },
      {
        nomUtilisateur: 'Bio-Polymères Client',
        email: 'client@biopolymeres.fr',
        motDePasse: 'bio123',
        role: { idRole: RoleUUIDs.CLIENT },
        idClient: clients[3],
        statut: UserStatus.ACTIVE,
      },
      {
        nomUtilisateur: 'CircularPlast Client',
        email: 'client@circularplast.fr',
        motDePasse: 'circular123',
        role: { idRole: RoleUUIDs.CLIENT },
        idClient: clients[4],
        statut: UserStatus.ACTIVE,
      },
    ]

    for (const userData of users) {
      const existingUser = await this.userRepository.findOneBy({ email: userData.email })
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.motDePasse, 10)
        await this.userRepository.save(
          this.userRepository.create({
            ...userData,
            motDePasse: hashedPassword,
          })
        )
      }
    }
  }

  private async seedOrders(clients: Client[]): Promise<void> {
    console.log('Seeding orders...')

    const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

    // Retry function for handling potential race conditions
    const retry = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
      try {
        return await fn()
      } catch (error) {
        if (retries <= 0) throw error
        await sleep(delay)
        return retry(fn, retries - 1, delay)
      }
    }

    const createOrder = async (
      client: Client,
      user: User,
      status: CommandeStatus,
      date: Date,
      index: number
    ): Promise<Commande> => {
      // Get random products for this order
      const products = await this.productRepository.find({
        take: Math.floor(Math.random() * 3) + 1, // 1-3 products per order
      })

      // Create line items for each product
      const lineItems = []
      let totalHt = 0
      let totalTax = 0
      let totalTtc = 0

      // Get all available sales units
      const salesUnitValues = Object.values(SalesUnit)

      for (const product of products) {
        const quantity = Math.floor(Math.random() * 5) + 1 // 1-5 quantity

        // Randomly select a sales unit from all available options
        const randomIndex = Math.floor(Math.random() * salesUnitValues.length)
        const salesUnit = salesUnitValues[randomIndex]

        // Get the weight for the selected sales unit
        const unitWeight = SalesUnitWeight[salesUnit]

        // Calculate price based on sales unit weight
        const unitPrice = product.prix * unitWeight
        const poidsTotal = unitWeight * quantity

        const itemTotalHt = unitPrice * quantity
        const itemTotalTax = itemTotalHt * (product.tauxTVA / 100)
        const itemTotalTtc = itemTotalHt + itemTotalTax

        totalHt += itemTotalHt
        totalTax += itemTotalTax
        totalTtc += itemTotalTtc

        const lineItem = this.dataSource.manager.create(LineItem, {
          produit: product,
          quantite: quantity,
          uniteVente: salesUnit,
          poidsTotal: poidsTotal,
          prixUnitaire: unitPrice,
          totalHt: itemTotalHt,
          totalTax: itemTotalTax,
          totalTtc: itemTotalTtc,
          statut: LineItemStatus.ACTIVE,
        })

        lineItems.push(lineItem)
      }

      // Create the order
      const randomSuffix = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0')
      const refCommande = `CMD-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(index).padStart(3, '0')}-${randomSuffix}`

      const commande = this.dataSource.manager.create(Commande, {
        dateCommande: date,
        client,
        utilisateur: user,
        statut: status,
        refCommande,
        dateLivraisonPrevue: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0], // 7 days after order
        totalHt,
        totalTaxe: totalTax,
        totalTtc,
      })

      // Save the order first
      const savedCommande = await this.dataSource.manager.save(commande)

      // Then save line items with the order reference
      for (const lineItem of lineItems) {
        lineItem.commande = savedCommande
        await this.dataSource.manager.save(lineItem)
      }

      // Create a payment for the order
      const paiement = this.dataSource.manager.create(Paiement, {
        montant: totalTtc,
        methodePaiement: Math.random() > 0.5 ? MethodPaiement.VIREMENT : MethodPaiement.CHEQUE,
        statut: PaiementStatus.PENDING,
        idCommande: savedCommande,
        idUtilisateur: user,
      })

      await this.dataSource.manager.save(paiement)

      return savedCommande
    }

    // Process clients in smaller batches
    const batchSize = 2 // Process 2 clients at a time
    for (let i = 0; i < clients.length; i += batchSize) {
      const clientBatch = clients.slice(i, i + batchSize)

      // Process each client in the batch
      for (const client of clientBatch) {
        // Find users associated with this client
        const clientUser = await this.userRepository
          .createQueryBuilder('user')
          .where('user.idClientIdClient = :clientId', { clientId: client.idClient })
          .getOne()

        if (clientUser) {
          // Reduce number of orders per client to avoid overloading the DB
          const numOrders = Math.floor(Math.random() * 3) + 2 // 2-4 orders per client
          const statuses = [
            CommandeStatus.DELIVERED,
            CommandeStatus.SHIPPED,
            CommandeStatus.CONFIRMED,
            CommandeStatus.PENDING,
            CommandeStatus.CANCELLED,
          ]

          for (let i = 0; i < numOrders; i++) {
            const date = new Date()
            date.setDate(date.getDate() - i * 3) // Orders spaced 3 days apart
            const status = statuses[i % statuses.length]

            // Use retry logic for each order creation
            try {
              await retry(() => createOrder(client, clientUser, status, date, i))
              // Add a small delay between order creations
              await sleep(100)
            } catch (error) {
              console.error(
                `Failed to create order for client ${client.idClient} after retries:`,
                error
              )
              // Continue with next order instead of failing the entire seeding process
            }
          }
        }
      }

      // Add a delay between batches to avoid overwhelming the database
      await sleep(500)
    }
  }

  private async createExtensions(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()

    try {
      await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      console.log('✅ Extension "uuid-ossp" créée avec succès.')
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'extension "uuid-ossp":', error)
    } finally {
      await queryRunner.release()
    }
  }
}
