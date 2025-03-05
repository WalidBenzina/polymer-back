import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { Client } from './client.entity'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'
import { User } from 'src/user/user.entity'
import { Role } from 'src/role/role.entity'
import { UserStatus } from 'src/enums/user-status.enum'
import { ClientStatus } from 'src/enums/client-status.enum'
import { PaginationDto } from 'src/pagination/pagination.dto'
import { DataSource } from 'typeorm'

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly dataSource: DataSource
  ) {}

  async activateClient(id: string) {
    try {
      const client = await this.clientRepository.findOne({
        where: { idClient: id },
        relations: ['utilisateurs', 'utilisateurs.role', 'utilisateurs.idClient', 'commandes'],
      })

      if (!client) {
        throw new NotFoundException(`Client with ID ${id} not found.`)
      }

      client.statut = ClientStatus.ACTIVE
      await this.clientRepository.save(client)

      for (const user of client.utilisateurs) {
        user.statut = UserStatus.ACTIVE
        await this.userRepository.save(user)
      }

      return this.entityToModel(client)
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to activate client and users. Please try again later. ' + error
      )
    }
  }

  async deactivateClient(id: string) {
    try {
      const client = await this.clientRepository.findOne({
        where: { idClient: id },
        relations: ['utilisateurs', 'utilisateurs.role', 'utilisateurs.idClient', 'commandes'],
      })

      if (!client) {
        throw new NotFoundException(`Client with ID ${id} not found.`)
      }

      client.statut = ClientStatus.INACTIVE
      await this.clientRepository.save(client)

      for (const user of client.utilisateurs) {
        user.statut = UserStatus.INACTIVE
        await this.userRepository.save(user)
      }

      return this.entityToModel(client)
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to deactivate client and users. Please try again later. ' + error
      )
    }
  }

  private userEntityToModel(user: User) {
    return {
      idUtilisateur: user.idUtilisateur,
      nomUtilisateur: user.nomUtilisateur,
      email: user.email,
      statut: user.statut,
    }
  }

  private entityToModel(client: Client) {
    const lastOrder = client.commandes?.sort(
      (a, b) => new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime()
    )[0]

    return {
      idClient: client.idClient,
      nomClient: client.nomClient,
      email: client.email,
      adresse: client.adresse,
      telephone: client.telephone,
      statut: client.statut,
      utilisateurs: client.utilisateurs?.map((user) => this.userEntityToModel(user)),
      totalCommandes: client.commandes?.length || 0,
      derniereDateCommande: lastOrder?.dateCommande || null,
    }
  }

  async create(createClientDto: CreateClientDto) {
    try {
      const client = this.clientRepository.create(createClientDto)
      const savedClient = await this.clientRepository.save(client)

      const clientRole = await this.dataSource
        .getRepository(Role)
        .findOne({ where: { nomRole: 'Client' } })

      if (!clientRole) {
        throw new Error('Client role not found')
      }

      const hashedPassword = await bcrypt.hash(createClientDto.telephone, 10)
      const user: User = this.userRepository.create({
        nomUtilisateur: createClientDto.nomClient,
        email: createClientDto.email,
        motDePasse: hashedPassword,
        role: clientRole,
        idClient: savedClient,
        statut: UserStatus.INACTIVE,
      })

      await this.userRepository.save(user)

      return this.entityToModel(savedClient)
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create client. Please try again later. ' + error
      )
    }
  }

  async findAll(
    paginationDto: PaginationDto
  ): Promise<{ data: any[]; total: number; currentPage: number; totalPages: number }> {
    const { page, limit } = paginationDto

    try {
      const [result, total] = await this.clientRepository.findAndCount({
        relations: ['utilisateurs', 'utilisateurs.role', 'utilisateurs.idClient', 'commandes'],
        skip: (page - 1) * limit,
        take: limit,
      })

      const totalPages = Math.ceil(total / limit)

      return {
        data: result.map((client) => this.entityToModel(client)),
        total,
        currentPage: page,
        totalPages,
      }
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while retrieving clients. ' + error)
    }
  }

  async findOne(id: string) {
    try {
      const client = await this.clientRepository.findOne({
        where: { idClient: id },
        relations: ['utilisateurs', 'utilisateurs.role', 'utilisateurs.idClient', 'commandes'],
      })

      if (!client) {
        throw new NotFoundException(`Client with ID ${id} not found.`)
      }

      return this.entityToModel(client)
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving the client. ' + error
      )
    }
  }

  async update(id: string, updateData: UpdateClientDto) {
    try {
      const clientExists = await this.clientRepository.findOne({
        where: { idClient: id },
      })

      if (!clientExists) {
        throw new NotFoundException(`Client with ID ${id} not found.`)
      }

      await this.clientRepository.update(id, updateData)
      const updatedClient = await this.findOne(id)

      return updatedClient
    } catch (error) {
      throw new InternalServerErrorException('Failed to update client. Please try again. ' + error)
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const client = await this.clientRepository.findOne({
        where: { idClient: id },
        relations: ['utilisateurs'],
      })

      if (!client) {
        throw new NotFoundException(`Client with ID ${id} not found.`)
      }

      for (const user of client.utilisateurs) {
        await this.userRepository.delete(user.idUtilisateur)
      }

      const result = await this.clientRepository.delete(id)

      if (result.affected === 0) {
        throw new NotFoundException(`Failed to delete client with ID ${id}.`)
      }

      return `Client with ID ${id} and its associated users have been successfully deleted.`
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException(
        'Failed to delete client and its associated users. Please try again later. ' + error
      )
    }
  }
}
