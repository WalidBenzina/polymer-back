import { IsNotEmpty, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { RoleStatus } from 'src/enums/role-status.enum'
import { PermissionType } from 'src/common/types/permissions.type'

export class CreateRoleDto {
  @ApiProperty({ example: 'Admin', description: 'Le nom du rôle' })
  @IsNotEmpty()
  nomRole: string

  @ApiProperty({
    example: [PermissionType.CREATE_DOCUMENT, PermissionType.READ_DOCUMENT],
    description: 'Liste des permissions accordées au rôle',
  })
  @IsNotEmpty()
  permissions: string[]

  @ApiProperty({
    example: RoleStatus.ACTIVE,
    description: 'Statut du rôle',
    enum: RoleStatus,
  })
  @IsEnum(RoleStatus)
  statut: RoleStatus
}
