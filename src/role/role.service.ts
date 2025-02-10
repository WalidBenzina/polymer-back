import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Role } from './role.entity'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RoleModel } from 'src/_models/role.model'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async createRole(createRoleDto: CreateRoleDto) {
    const roleEntity = this.roleRepository.create(createRoleDto)
    const role = await this.roleRepository.save(roleEntity)

    return this.toRoleModel(role)
  }

  async findAllRoles() {
    const roles = await this.roleRepository.find()
    return roles.map((role) => this.toRoleModel(role))
  }

  async findRoleById(id: string) {
    const role = await this.roleRepository.findOneOrFail({ where: { idRole: id } })
    return this.toRoleModel(role)
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
    await this.roleRepository.update(id, updateRoleDto)
    const updatedRole = await this.roleRepository.findOneOrFail({ where: { idRole: id } })
    return this.toRoleModel(updatedRole)
  }

  async deleteRole(id: string): Promise<string> {
    const role = await this.roleRepository.findOne({ where: { idRole: id } })

    if (!role) {
      throw new Error(`Role with ID ${id} not found.`)
    }

    await this.roleRepository.delete(id)
    return `Role with ID ${id} has been successfully deleted.`
  }

  private toRoleModel(role: Role) {
    return {
      idRole: role.idRole,
      nomRole: role.nomRole,
      permissions: role.permissions,
      statut: role.statut,
    }
  }
}
