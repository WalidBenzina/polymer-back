import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Configuration } from './configuration.entity'
import { CreateConfigurationDto } from './dto/create-configuration.dto'
import { UpdateConfigurationDto } from './dto/update-configuration.dto'
import { ConfigurationModel } from 'src/_models/configuration.model'
import { PaginationDto } from 'src/pagination/pagination.dto'

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectRepository(Configuration)
    private configurationRepository: Repository<Configuration>
  ) {}

  async create(createConfigurationDto: CreateConfigurationDto) {
    try {
      const configuration = this.configurationRepository.create(createConfigurationDto)
      const savedConfiguration = await this.configurationRepository.save(configuration)

      return this.mapToModel(savedConfiguration)
    } catch (error) {
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la création de la configuration.'
      )
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<{
    data: any[]
    total: number
    currentPage: number
    totalPages: number
  }> {
    try {
      const { page, limit } = paginationDto

      const [configurations, total] = await this.configurationRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      })

      if (total === 0) {
        throw new NotFoundException('Aucune configuration trouvée.')
      }

      const totalPages = Math.ceil(total / limit)
      const data = configurations.map(this.mapToModel)

      return {
        data,
        total,
        currentPage: page,
        totalPages,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la récupération des configurations.'
      )
    }
  }

  async findOne(id: string) {
    try {
      const configuration = await this.configurationRepository.findOne({ where: { id } })
      if (!configuration) {
        throw new NotFoundException(`Configuration avec l'ID ${id} non trouvée.`)
      }

      return this.mapToModel(configuration)
    } catch (error) {
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la récupération de la configuration.'
      )
    }
  }

  async update(id: string, updateConfigurationDto: UpdateConfigurationDto) {
    try {
      const existingConfiguration = await this.configurationRepository.findOne({ where: { id } })
      if (!existingConfiguration) {
        throw new NotFoundException(`Configuration avec l'ID ${id} non trouvée.`)
      }

      await this.configurationRepository.update(id, updateConfigurationDto)
      const updatedConfiguration = await this.configurationRepository.findOne({ where: { id } })

      return this.mapToModel(updatedConfiguration)
    } catch (error) {
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la mise à jour de la configuration.'
      )
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const result = await this.configurationRepository.delete(id)
      if (result.affected === 0) {
        throw new NotFoundException(`Configuration avec l'ID ${id} non trouvée.`)
      }
      return `Configuration avec l'ID ${id} supprimée avec succès.`
    } catch (error) {
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la suppression de la configuration.'
      )
    }
  }

  private mapToModel(configuration: Configuration) {
    return {
      id: configuration.id,
      nomEntreprise: configuration.nomEntreprise,
      adresseEntreprise: configuration.adresseEntreprise,
      telephoneEntreprise1: configuration.telephoneEntreprise1,
      telephoneEntreprise2: configuration.telephoneEntreprise1,
      emailEntreprise: configuration.emailEntreprise,
      siteWebEntreprise: configuration.siteWebEntreprise,
      logoEntrepriseUrl: configuration.logoEntrepriseUrl,
      identifiantsEntreprise: configuration.identifiantsEntreprise,
      comptesBancairesEntreprise: configuration.comptesBancairesEntreprise,
      variablesEnvironnementales: configuration.variablesEnvironnementales,
    }
  }
}
