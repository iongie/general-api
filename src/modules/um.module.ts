import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth.module';
import { um_UserEntity } from '../entities/um_user.entity';
import { um_RoleEntity } from '../entities/um_role.entity';
import { um_PermissionEntity } from '../entities/um_permission.entity';
import { sm_ActivityLogEntity } from '../entities/um_activity_log.entity';
import { um_UserController } from '../controllers/um_user.controller';
import { um_RoleController } from '../controllers/um_role.controller';
import { um_PermissionController } from '../controllers/um_permission.controller';
import { ProfileController } from '../controllers/profile.controller';
import { um_UserService } from '../services/um_user.service';
import { um_RoleService } from '../services/um_role.service';
import { um_PermissionService } from '../services/um_permission.service';
import { um_ActivityLogService } from '../services/um_activity_log.service';
import { SftpService } from '../services/sftp.service';
import { ImageService } from '../services/image.service';
import { PermissionsGuard } from '../securities/permissions.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      um_UserEntity,
      um_RoleEntity,
      um_PermissionEntity,
      sm_ActivityLogEntity,
    ]),
    AuthModule,
  ],
  controllers: [
    um_UserController,
    um_RoleController,
    um_PermissionController,
    ProfileController,
  ],
  providers: [
    um_UserService,
    um_RoleService,
    um_PermissionService,
    um_ActivityLogService,
    SftpService,
    ImageService,
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  exports: [
    um_UserService,
    um_RoleService,
    um_PermissionService,
    um_ActivityLogService,
    SftpService,
    ImageService,
  ],
})
export class UmModule {}
