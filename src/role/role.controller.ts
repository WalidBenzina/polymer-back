import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import { RoleService } from './role.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { RoleModel } from 'src/_models/role.model'

import { PermissionsGuard } from 'src/auth/guards/permissions.guard'
import { JwtAuthGuard } from 'src/auth/local-auth.guard'

@ApiTags('Roles Management')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Role created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiOperation({ summary: 'Create a new role' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto)
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Roles retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'No roles found.' })
  @ApiOperation({ summary: 'Retrieve all roles' })
  async findAll() {
    return this.roleService.findAllRoles()
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Role retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiOperation({ summary: 'Retrieve a specific role by ID' })
  async findOne(@Param('id') id: string) {
    return this.roleService.findRoleById(id)
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Role updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiOperation({ summary: 'Update a specific role by ID' })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.updateRole(id, updateRoleDto)
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Role deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiOperation({ summary: 'Delete a specific role by ID' })
  async deleteRole(@Param('id') id: string) {
    try {
      const message = await this.roleService.deleteRole(id)
      return { message }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND)
    }
  }
}
