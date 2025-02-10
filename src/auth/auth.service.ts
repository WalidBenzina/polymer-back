import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common'
import { User } from '../user/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { JwtService } from '@nestjs/jwt'
import { Role } from 'src/role/role.entity'
import { Client } from 'src/client/client.entity'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const { nomUtilisateur, email, motDePasse, nomRole, idClient } = registerDto

    const role = await this.roleRepository.findOne({ where: { nomRole } })
    if (!role) {
      throw new NotFoundException(`Role ${nomRole} not found`)
    }

    let client: Client | null = null
    if (idClient) {
      client = await this.clientRepository.findOne({ where: { idClient } })
      if (!client) {
        throw new NotFoundException(`Client with ID ${idClient} not found`)
      }
    }

    const hashedPassword = await bcrypt.hash(motDePasse, 10)

    const user = this.userRepository.create({
      nomUtilisateur,
      email,
      motDePasse: hashedPassword,
      role: role,
      idClient: client,
    })

    const savedUser = await this.userRepository.save(user)

    return this.mapUserToUserModel(savedUser)
  }

  mapUserToUserModel(user: User) {
    return {
      idUtilisateur: user.idUtilisateur,
      nomUtilisateur: user.nomUtilisateur,
      email: user.email,
      statut: user.statut,
      role: {
        idRole: user.role.idRole,
        nomRole: user.role.nomRole,
        permissions: user.role.permissions,
      },
      idClient: user.idClient
        ? {
            idClient: user.idClient.idClient,
            nomClient: user.idClient.nomClient,
            email: user.idClient.email,
            adresse: user.idClient.adresse,
            telephone: user.idClient.telephone,
            statut: user.idClient.statut,
          }
        : null,
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email: email },
      relations: ['role', 'idClient'],
    })

    if (user && (await bcrypt.compare(password, user.motDePasse))) {
      return user
    }
    throw new UnauthorizedException('Invalid email or password')
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, motDePasse } = loginDto

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role', 'idClient'],
    })

    if (!user || !(await bcrypt.compare(motDePasse, user.motDePasse))) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const payload = {
      email: user.email,
      sub: user.idUtilisateur,
      idClient: user.idClient?.idClient || null,
      role: {
        idRole: user.role.idRole,
        nomRole: user.role.nomRole,
        permissions: user.role.permissions,
        statut: user.role.statut,
      },
    }
    const token = this.jwtService.sign(payload)

    return {
      access_token: token,
    }
  }
}
