import { SetMetadata } from '@nestjs/common'
import { PERMISSIONS_KEY } from 'src/common/constants/permissions.constants'
import { PermissionType } from 'src/common/types/permissions.type'

export const Permissions = (...permissions: PermissionType[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions)
