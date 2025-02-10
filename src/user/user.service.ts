import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UpdateUserDto } from 'src/user/dto/update-user.dto'
import { User } from 'src/user/user.entity'
import { PaginationDto } from 'src/pagination/pagination.dto'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { Role } from 'src/role/role.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async findAll(
    paginationDto: PaginationDto,
    roles?: string | string[]
  ): Promise<{ data: User[]; total: number }> {
    const { page, limit } = paginationDto

    const rolesArray = Array.isArray(roles) ? roles : roles ? [roles] : []

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.idClient', 'idClient')

    if (rolesArray.length > 0) {
      queryBuilder.andWhere('role.nomRole IN (:...roles)', { roles: rolesArray })
    }

    queryBuilder.skip((page - 1) * limit).take(limit)
    const [result, total] = await queryBuilder.getManyAndCount()
    const data = result.map((user) => this.formatUserResponse(user))

    return {
      data: data as User[],
      total: total,
    }
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { idUtilisateur: id },
      relations: ['role', 'idClient'],
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return this.formatUserResponse(user)
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findUserById(userId)

    if (updateUserDto.motDePasse) {
      const hashedPassword = await bcrypt.hash(updateUserDto.motDePasse, 10)
      updateUserDto.motDePasse = hashedPassword
    }

    if (updateUserDto.nomRole) {
      const role = await this.roleRepository.findOne({
        where: { nomRole: updateUserDto.nomRole },
      })
      if (!role) {
        throw new NotFoundException(`Role ${updateUserDto.nomRole} not found`)
      }
      user.role = role
      delete updateUserDto.nomRole
    }

    Object.assign(user, updateUserDto)

    const updatedUser = await this.userRepository.save(user)
    return this.formatUserResponse(updatedUser)
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.findUserById(userId)
    await this.userRepository.remove(user)
  }

  async updatePassword(userId: string, password: string, confirmPassword: string): Promise<User> {
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match')
    }

    const user = await this.findUserById(userId)

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    user.motDePasse = hashedPassword

    const updatedUser = await this.userRepository.save(user)
    return this.formatUserResponse(updatedUser)
  }

  private formatUserResponse(user: User): User {
    return {
      idUtilisateur: user.idUtilisateur,
      nomUtilisateur: user.nomUtilisateur,
      email: user.email,
      motDePasse: user.motDePasse,
      statut: user.statut,
      role: user.role,
      idClient: user.idClient,
      commandes: user.commandes || null,
      paiements: user.paiements || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
