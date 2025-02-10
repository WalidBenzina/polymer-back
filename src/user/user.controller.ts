import {
  Body,
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  HttpCode,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { User } from 'src/user/user.entity'
import { UserService } from './user.service'
import { UpdateUserDto } from 'src/user/dto/update-user.dto'
import { PaginationDto } from 'src/pagination/pagination.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'

import { PermissionsGuard } from 'src/auth/guards/permissions.guard'
import { JwtAuthGuard } from 'src/auth/local-auth.guard'

@ApiTags('auth')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve paginated users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully.' })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('roles') roles?: string[]
  ): Promise<{ data: User[]; total: number; currentPage: number; totalPages: number }> {
    const { data, total } = await this.userService.findAll(paginationDto, roles)
    const currentPage = paginationDto.page
    const totalPages = Math.ceil(total / paginationDto.limit)

    return {
      data,
      total,
      currentPage,
      totalPages,
    }
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiOperation({ summary: 'Get user by ID' })
  async getUser(@Param('id') id: string): Promise<User> {
    return this.userService.findUserById(id)
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiOperation({ summary: 'Update user by ID' })
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.updateUser(id, updateUserDto)
  }

  @Patch(':id/password')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Password updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiOperation({ summary: 'Update user password by ID' })
  async updatePassword(
    @Param('id') userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto
  ): Promise<{ message: string }> {
    await this.userService.updatePassword(
      userId,
      updatePasswordDto.password,
      updatePasswordDto.confirmPassword
    )
    return { message: 'Password updated successfully.' }
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiOperation({ summary: 'Delete user by ID' })
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    await this.userService.deleteUser(id)
    return { message: 'Utilisateur supprimé avec succès.' }
  }
}
