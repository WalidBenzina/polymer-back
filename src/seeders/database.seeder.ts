import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { Role } from '@/role/role.entity'
import { RoleStatus } from '@/enums/role-status.enum'
import { PermissionType } from '@/common/types/permissions.type'
import { User } from '@/user/user.entity'
import { Client } from '@/client/client.entity'
import { Product } from '@/product/product.entity'
import { Commande } from '@/commande/commande.entity'
import { UserStatus } from '@/enums/user-status.enum'
import { ClientStatus } from '@/enums/client-status.enum'
import ProductStatus from '@/enums/product-status.enum'
import StockStatus from '@/enums/stock-status.enum'
import { CommandeStatus } from '@/enums/commande-status.enum'
import * as bcrypt from 'bcrypt'
import { Paiement } from '@/paiement/paiement.entity'
import { MethodPaiement } from '@/enums/method-paiement.enum'
import { PaiementStatus } from '@/enums/paiement-status.enum'
import { LineItemStatus } from '@/enums/line-item-status.enum'

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

  private async seedProducts(): Promise<Product[]> {
    const products = [
      {
        nomProduit: 'RPET Flakes Clear',
        description: 'Recycled PET flakes, clear color, suitable for food packaging',
        prix: 1200.0,
        quantiteDisponible: 5000,
        statut: ProductStatus.ACTIF,
        statutStock: StockStatus.DISPONIBLE,
        sku: 'RPET-FL-CLR-001',
        poids: 1.0,
        urlImage: 'https://picsum.photos/seed/rpet-flakes/800/600.webp',
        evaluation: 4.5,
        nombreVendu: 150,
        prixVente: 1450.0,
        prixAchat: 950.0,
        tauxTVA: 20.0,
        taxeActivee: true,
        hauteur: 25.5,
        largeur: 30.0,
        longueur: 40.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        nomProduit: 'HDPE Regrind',
        description: 'High-density polyethylene regrind from post-consumer waste',
        prix: 800.0,
        quantiteDisponible: 3000,
        statut: ProductStatus.ACTIF,
        statutStock: StockStatus.DISPONIBLE,
        sku: 'HDPE-RG-001',
        poids: 1.0,
        urlImage: 'https://picsum.photos/seed/hdpe-regrind/800/600.webp',
        evaluation: 4.2,
        nombreVendu: 220,
        prixVente: 950.0,
        prixAchat: 600.0,
        tauxTVA: 20.0,
        taxeActivee: true,
        hauteur: 20.0,
        largeur: 35.0,
        longueur: 45.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        nomProduit: 'PP Pellets Recycled',
        description: 'Recycled polypropylene pellets for injection molding.webp',
        prix: 950.0,
        quantiteDisponible: 4000,
        statut: ProductStatus.ACTIF,
        statutStock: StockStatus.DISPONIBLE,
        sku: 'PP-PL-REC-001',
        poids: 1.0,
        urlImage: 'https://picsum.photos/seed/pp-pellets/800/600.webp',
        evaluation: 4.3,
        nombreVendu: 180,
        prixVente: 1150.0,
        prixAchat: 750.0,
        tauxTVA: 20.0,
        taxeActivee: true,
        hauteur: 22.5,
        largeur: 32.0,
        longueur: 42.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        nomProduit: 'LDPE Resin Recycled',
        description: 'Low-density polyethylene resin from recycled materials',
        prix: 850.0,
        quantiteDisponible: 2500,
        statut: ProductStatus.ACTIF,
        statutStock: StockStatus.DISPONIBLE,
        sku: 'LDPE-RS-REC-001',
        poids: 1.0,
        urlImage: 'https://picsum.photos/seed/ldpe-resin/800/600.webp',
        evaluation: 4.0,
        nombreVendu: 130,
        prixVente: 1050.0,
        prixAchat: 650.0,
        tauxTVA: 20.0,
        taxeActivee: true,
        hauteur: 21.0,
        largeur: 31.0,
        longueur: 41.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        nomProduit: 'PVC Recyclé',
        description: 'Polyvinyl chloride recyclé pour applications industrielles',
        prix: 1100.0,
        quantiteDisponible: 2000,
        statut: ProductStatus.ACTIF,
        statutStock: StockStatus.DISPONIBLE,
        sku: 'PVC-REC-001',
        poids: 1.0,
        urlImage: 'https://picsum.photos/seed/pvc-recycle/800/600.webp',
        evaluation: 4.1,
        nombreVendu: 160,
        prixVente: 1350.0,
        prixAchat: 850.0,
        tauxTVA: 20.0,
        taxeActivee: true,
        hauteur: 23.0,
        largeur: 33.0,
        longueur: 43.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        nomProduit: 'ABS Recyclé',
        description: 'Acrylonitrile butadiène styrène recyclé pour moulage',
        prix: 1300.0,
        quantiteDisponible: 1500,
        statut: ProductStatus.ACTIF,
        statutStock: StockStatus.DISPONIBLE,
        sku: 'ABS-REC-001',
        poids: 1.0,
        urlImage: 'https://picsum.photos/seed/abs-recycle/800/600.webp',
        evaluation: 4.4,
        nombreVendu: 140,
        prixVente: 1550.0,
        prixAchat: 1050.0,
        tauxTVA: 20.0,
        taxeActivee: true,
        hauteur: 24.0,
        largeur: 34.0,
        longueur: 44.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        nomProduit: 'PS Recyclé',
        description: 'Polystyrène recyclé pour emballages',
        prix: 900.0,
        quantiteDisponible: 3500,
        statut: ProductStatus.ACTIF,
        statutStock: StockStatus.DISPONIBLE,
        sku: 'PS-REC-001',
        poids: 1.0,
        urlImage: 'https://picsum.photos/seed/ps-recycle/800/600.webp',
        evaluation: 4.2,
        nombreVendu: 170,
        prixVente: 1100.0,
        prixAchat: 700.0,
        tauxTVA: 20.0,
        taxeActivee: true,
        hauteur: 22.0,
        largeur: 32.0,
        longueur: 42.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        nomProduit: 'PC Recyclé',
        description: 'Polycarbonate recyclé haute qualité',
        prix: 1500.0,
        quantiteDisponible: 1000,
        statut: ProductStatus.ACTIF,
        statutStock: StockStatus.DISPONIBLE,
        sku: 'PC-REC-001',
        poids: 1.0,
        urlImage: 'https://picsum.photos/seed/pc-recycle/800/600.webp',
        evaluation: 4.6,
        nombreVendu: 120,
        prixVente: 1800.0,
        prixAchat: 1200.0,
        tauxTVA: 20.0,
        taxeActivee: true,
        hauteur: 26.0,
        largeur: 36.0,
        longueur: 46.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        nomProduit: 'PA Recyclé',
        description: 'Polyamide recyclé pour applications techniques',
        prix: 1400.0,
        quantiteDisponible: 1200,
        statut: ProductStatus.ACTIF,
        statutStock: StockStatus.DISPONIBLE,
        sku: 'PA-REC-001',
        poids: 1.0,
        urlImage: 'https://picsum.photos/seed/pa-recycle/800/600.webp',
        evaluation: 4.3,
        nombreVendu: 110,
        prixVente: 1650.0,
        prixAchat: 1100.0,
        tauxTVA: 20.0,
        taxeActivee: true,
        hauteur: 25.0,
        largeur: 35.0,
        longueur: 45.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        nomProduit: 'PET Recyclé',
        description: 'Polyéthylène téréphtalate recyclé pour bouteilles',
        prix: 1000.0,
        quantiteDisponible: 4500,
        statut: ProductStatus.ACTIF,
        statutStock: StockStatus.DISPONIBLE,
        sku: 'PET-REC-001',
        poids: 1.0,
        urlImage: 'https://picsum.photos/seed/pet-recycle/800/600.webp',
        evaluation: 4.5,
        nombreVendu: 200,
        prixVente: 1250.0,
        prixAchat: 800.0,
        tauxTVA: 20.0,
        taxeActivee: true,
        hauteur: 23.5,
        largeur: 33.5,
        longueur: 43.5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    const savedProducts: Product[] = []
    for (const productData of products) {
      const existingProduct = await this.productRepository.findOneBy({ sku: productData.sku })
      if (!existingProduct) {
        const savedProduct = await this.productRepository.save(
          this.productRepository.create(productData)
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
    const products = await this.productRepository.find()
    const users = await this.userRepository.find({ relations: ['idClient'] })

    // Helper function to wait between operations
    const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

    // Retry function with exponential backoff
    const retry = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
      try {
        return await fn()
      } catch (error) {
        if (retries <= 0) throw error
        console.log(`Retrying operation after ${delay}ms...`)
        await sleep(delay)
        return retry(fn, retries - 1, delay * 2)
      }
    }

    const createOrder = async (
      client: Client,
      user: User,
      status: CommandeStatus,
      date: Date,
      index: number
    ): Promise<Commande> => {
      try {
        const numItems = Math.floor(Math.random() * 3) + 1
        const orderItems = []
        let totalHt = 0

        for (let i = 0; i < numItems; i++) {
          const product = products[Math.floor(Math.random() * products.length)]
          const quantity = Math.floor(Math.random() * 100) + 1
          const itemTotal = product.prix * quantity

          orderItems.push({
            produit: product,
            quantite: quantity,
            statut: LineItemStatus.ACTIVE,
            totalHt: itemTotal,
            totalTax: itemTotal * 0.2,
            totalTtc: itemTotal + itemTotal * 0.2,
            prixUnitaire: product.prix,
            total: itemTotal,
          })

          totalHt += itemTotal
        }

        const totalTaxe = totalHt * 0.2
        const totalTtc = totalHt + totalTaxe

        // Generate a unique reference using client ID, timestamp, and index
        const timestamp = date.getTime()
        const refCommande = `CMD-${client.idClient.slice(0, 4)}-${timestamp}-${index}`

        // Calculate delivery date
        const deliveryDate = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000)
        const formattedDeliveryDate = deliveryDate.toISOString().split('T')[0]

        // Generate payment method before creating the order
        const paymentMethod = Math.random() < 0.5 ? MethodPaiement.VIREMENT : MethodPaiement.CHEQUE

        // Create order without payment first
        const orderEntity = this.commandeRepository.create({
          dateCommande: date.toISOString().split('T')[0],
          client: client,
          utilisateur: user,
          statut: status,
          refCommande,
          lineItems: orderItems,
          totalHt,
          totalTaxe,
          totalTtc,
          dateLivraisonPrevue: formattedDeliveryDate,
        })

        // Save the order
        const savedOrder = await this.commandeRepository.save(orderEntity)

        // Determine payment status based on order status
        let paymentStatus = PaiementStatus.PENDING

        // Définir le statut du paiement en fonction du statut de la commande
        switch (status) {
          case CommandeStatus.DELIVERED:
            paymentStatus = PaiementStatus.COMPLETED
            break
          case CommandeStatus.CANCELLED:
            paymentStatus = Math.random() < 0.5 ? PaiementStatus.FAILED : PaiementStatus.REFUNDED
            break
          case CommandeStatus.SHIPPED:
          case CommandeStatus.CONFIRMED:
            paymentStatus = Math.random() < 0.7 ? PaiementStatus.COMPLETED : PaiementStatus.PENDING
            break
          default:
            paymentStatus = PaiementStatus.PENDING
        }

        // Create payment with reference to the saved order
        const paymentEntity = this.paiementRepository.create({
          montant: totalTtc,
          methodePaiement: paymentMethod,
          statut: paymentStatus,
          idCommande: savedOrder,
          idUtilisateur: user,
        })

        // Save the payment
        const savedPayment = await this.paiementRepository.save(paymentEntity)

        // Update the order with the payment reference
        if (!savedOrder.paiements) {
          savedOrder.paiements = []
        }
        savedOrder.paiements.push(savedPayment)
        await this.commandeRepository.save(savedOrder)

        return savedOrder
      } catch (error) {
        console.error(`Error creating order: ${error.message}`)
        throw error
      }
    }

    // Process clients in smaller batches
    const batchSize = 2 // Process 2 clients at a time
    for (let i = 0; i < clients.length; i += batchSize) {
      const clientBatch = clients.slice(i, i + batchSize)

      // Process each client in the batch
      for (const client of clientBatch) {
        const clientUser = users.find((u) => u.idClient?.idClient === client.idClient)
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
