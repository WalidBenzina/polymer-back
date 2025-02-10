import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { OffreDePrix } from './offre-de-prix.entity'
import { CreateOffreDePrixDto } from './dto/create-offre-de-prix.dto'
import { UpdateOffreDePrixDto } from './dto/update-offre-de-prix.dto'
import { Client } from 'src/client/client.entity'

@Injectable()
export class OffreDePrixService {
  constructor(
    @InjectRepository(OffreDePrix)
    private offreDePrixRepository: Repository<OffreDePrix>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>
  ) {}

  private offreDePrixEntityToModel(offre: OffreDePrix) {
    return {
      idOffre: offre.idOffre,
      description: offre.description,
      montant: offre.montant,
      statut: offre.statut,
      client: {
        idClient: offre.client.idClient,
        nomClient: offre.client.nomClient,
        email: offre.client.email,
      },
    }
  }

  async create(createOffreDePrixDto: CreateOffreDePrixDto) {
    const client = await this.clientRepository.findOne({
      where: { idClient: createOffreDePrixDto.client },
    })

    if (!client) {
      throw new NotFoundException('Client not found')
    }

    const offre = this.offreDePrixRepository.create({
      ...createOffreDePrixDto,
      client: client,
    })

    const savedOffre = await this.offreDePrixRepository.save(offre)
    return this.offreDePrixEntityToModel(savedOffre)
  }

  async update(id: string, updateOffreDePrixDto: UpdateOffreDePrixDto) {
    const offre = await this.offreDePrixRepository.findOne({
      where: { idOffre: id },
      relations: ['client'],
    })

    if (!offre) {
      throw new NotFoundException('Offre de prix not found')
    }

    if (!offre.client) {
      throw new NotFoundException('Client not found for this offer')
    }

    Object.assign(offre, updateOffreDePrixDto)
    const updatedOffre = await this.offreDePrixRepository.save(offre)
    return this.offreDePrixEntityToModel(updatedOffre)
  }

  async findLatestByClient(clientId: string) {
    try {
      const offre = await this.offreDePrixRepository
        .createQueryBuilder('offre')
        .leftJoinAndSelect('offre.client', 'client')
        .where('offre.client = :clientId', { clientId })
        .orderBy('offre.createdAt', 'DESC')
        .limit(1)
        .getOne()

      if (!offre) {
        return {
          message: 'Aucune offre de prix trouvée pour ce client.',
          data: null,
        }
      }

      const formattedData = this.offreDePrixEntityToModel(offre)

      return {
        message: 'Dernière offre de prix récupérée avec succès.',
        data: formattedData,
      }
    } catch (error) {
      throw new HttpException(
        {
          message: "Une erreur s'est produite lors de la récupération de l'offre de prix.",
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
