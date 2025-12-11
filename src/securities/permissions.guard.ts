import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { um_UserService } from '../services/um_user.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private userService: um_UserService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredPermissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.userId) {
            return false;
        }

        try {
            const userEntity = await this.userService.findByIdWithPermissions(user.userId);
            const userPermissions = userEntity.roles.flatMap(role => role.permissions.map(p => p.slug));

            return requiredPermissions.some(permission => userPermissions.includes(permission));
        } catch (error) {
            return false;
        }
    }
}
