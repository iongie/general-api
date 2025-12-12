import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { um_PermissionService } from '../services/um_permission.service';
import { CreatePermissionDto, UpdatePermissionDto, PermissionQueryDto } from '../dtos/um_permission.dto';
import { JwtAuthGuard } from 'src/securities/jwt.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';
import { ActivityLogInterceptor } from '../interceptors/activity-log.interceptor';
import { ActivityLog } from '../decorators/activity-log.decorator';
import { ActivityType } from '../entities/um_activity_log.entity';

@Controller('permissions')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ActivityLogInterceptor)
export class um_PermissionController {
    constructor(private readonly permissionService: um_PermissionService) { }

    @Post()
    @RequirePermissions('create-permissions')
    @ActivityLog({ type: ActivityType.CREATE, action: 'Create Permission', resource: 'Permission' })
    create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionService.create(createPermissionDto);
    }

    @Get()
    @RequirePermissions('view-permissions')
    findAll(@Query() query: PermissionQueryDto) {
        return this.permissionService.findAll(query);
    }

    @Get(':id')
    @RequirePermissions('view-permissions')
    findOne(@Param('id') id: string) {
        return this.permissionService.findOne(id);
    }

    @Patch(':id')
    @RequirePermissions('edit-permissions')
    @ActivityLog({ type: ActivityType.UPDATE, action: 'Update Permission', resource: 'Permission' })
    update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
        return this.permissionService.update(id, updatePermissionDto);
    }

    @Delete(':id')
    @RequirePermissions('delete-permissions')
    @ActivityLog({ type: ActivityType.DELETE, action: 'Delete Permission', resource: 'Permission' })
    remove(@Param('id') id: string) {
        return this.permissionService.remove(id);
    }
}
