import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { PERMISSIONS_KEY } from 'src/common/constants/permissions.constants'
import { PermissionType } from 'src/common/types/permissions.type'

@Injectable()
export class PermissionsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user || !user.role || !user.role.permissions) {
      throw new ForbiddenException('User permissions are not defined')
    }

    const requiredPermissions = this.getRequiredPermissions(context)

    const hasPermission = requiredPermissions.some(
      (permission) =>
        user.role.permissions.includes(permission) ||
        user.role.permissions.includes(PermissionType.ALL)
    )

    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to access this resource')
    }

    return true
  }

  private getRequiredPermissions(context: ExecutionContext): string[] {
    const handler = context.getHandler()
    const permissions = Reflect.getMetadata(PERMISSIONS_KEY, handler)
    return permissions || [PermissionType.ALL]
  }
}
