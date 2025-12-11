import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { um_PermissionService } from '../services/um_permission.service';
import { CreatePermissionDto, UpdatePermissionDto, PermissionQueryDto } from '../dtos/um_permission.dto';
import { JwtAuthGuard } from 'src/securities/jwt.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';

@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class um_PermissionController {
    constructor(private readonly permissionService: um_PermissionService) { }

    @Post()
    @RequirePermissions('create-permissions')
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
    update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
        return this.permissionService.update(id, updatePermissionDto);
    }

    @Delete(':id')
    @RequirePermissions('delete-permissions')
    remove(@Param('id') id: string) {
        return this.permissionService.remove(id);
    }
}
