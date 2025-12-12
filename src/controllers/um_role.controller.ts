import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { um_RoleService } from '../services/um_role.service';
import { CreateRoleDto, UpdateRoleDto, RoleQueryDto, AssignPermissionsDto, RemovePermissionsDto } from '../dtos/um_role.dto';
import { JwtAuthGuard } from 'src/securities/jwt.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';
import { ActivityLogInterceptor } from '../interceptors/activity-log.interceptor';
import { ActivityLog } from '../decorators/activity-log.decorator';
import { ActivityType } from '../entities/um_activity_log.entity';

@Controller('roles')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ActivityLogInterceptor)
export class um_RoleController {
    constructor(private readonly roleService: um_RoleService) { }

    @Post()
    @RequirePermissions('create-roles')
    @ActivityLog({ type: ActivityType.CREATE, action: 'Create Role', resource: 'Role' })
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.roleService.create(createRoleDto);
    }

    @Get()
    @RequirePermissions('view-roles')
    findAll(@Query() query: RoleQueryDto) {
        return this.roleService.findAll(query);
    }

    @Get(':id')
    @RequirePermissions('view-roles')
    findOne(@Param('id') id: string) {
        return this.roleService.findOne(id);
    }

    @Patch(':id')
    @RequirePermissions('edit-roles')
    @ActivityLog({ type: ActivityType.UPDATE, action: 'Update Role', resource: 'Role' })
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
        return this.roleService.update(id, updateRoleDto);
    }

    @Delete(':id')
    @RequirePermissions('delete-roles')
    @ActivityLog({ type: ActivityType.DELETE, action: 'Delete Role', resource: 'Role' })
    remove(@Param('id') id: string) {
        return this.roleService.remove(id);
    }

    @Post(':id/permissions')
    @RequirePermissions('edit-roles')
    @ActivityLog({ type: ActivityType.UPDATE, action: 'Assign Permissions', resource: 'Role' })
    assignPermissions(@Param('id') id: string, @Body() assignPermissionsDto: AssignPermissionsDto) {
        return this.roleService.assignPermissions(id, assignPermissionsDto);
    }

    @Delete(':id/permissions')
    @RequirePermissions('edit-roles')
    @ActivityLog({ type: ActivityType.UPDATE, action: 'Remove Permissions', resource: 'Role' })
    removePermissions(@Param('id') id: string, @Body() removePermissionsDto: RemovePermissionsDto) {
        return this.roleService.removePermissions(id, removePermissionsDto);
    }
}
