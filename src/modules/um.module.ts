import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { um_UserEntity } from '../entities/um_user.entity';
import { um_RoleEntity } from '../entities/um_role.entity';
import { um_PermissionEntity } from '../entities/um_permission.entity';
import { um_UserController } from '../controllers/um_user.controller';
import { um_RoleController } from '../controllers/um_role.controller';
import { um_PermissionController } from '../controllers/um_permission.controller';
import { um_UserService } from '../services/um_user.service';
import { um_RoleService } from '../services/um_role.service';
import { um_PermissionService } from '../services/um_permission.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            um_UserEntity,
            um_RoleEntity,
            um_PermissionEntity,
        ]),
    ],
    controllers: [
        um_UserController,
        um_RoleController,
        um_PermissionController,
    ],
    providers: [
        um_UserService,
        um_RoleService,
        um_PermissionService,
    ],
    exports: [
        um_UserService,
        um_RoleService,
        um_PermissionService,
    ],
})
export class UmModule { }
