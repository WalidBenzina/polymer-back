import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { RoleStatus } from 'src/enums/role-status.enum'
import { PermissionType } from 'src/common/types/permissions.type'

export class UpdateRoleDto {
  @ApiProperty({ example: 'Admin', description: 'Le nom du rôle à mettre à jour' })
  @IsNotEmpty()
  nomRole: string

  @ApiProperty({
    example: [PermissionType.CREATE_DOCUMENT, PermissionType.READ_DOCUMENT],
    description: 'Liste des permissions à mettre à jour pour le rôle',
  })
  @IsNotEmpty()
  permissions: string[]

  @ApiProperty({
    example: RoleStatus.ACTIVE,
    description: 'Statut du rôle à mettre à jour',
    enum: RoleStatus,
    required: false,
  })
  @IsEnum(RoleStatus)
  @IsOptional()
  statut?: RoleStatus
}
