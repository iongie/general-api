import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { um_RoleService } from '../services/um_role.service';
import { CreateRoleDto, UpdateRoleDto, RoleQueryDto, AssignPermissionsDto, RemovePermissionsDto } from '../dtos/um_role.dto';
import { JwtAuthGuard } from 'src/securities/jwt.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class um_RoleController {
    constructor(private readonly roleService: um_RoleService) { }

    @Post()
    @RequirePermissions('create-roles')
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
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
        return this.roleService.update(id, updateRoleDto);
    }

    @Delete(':id')
    @RequirePermissions('delete-roles')
    remove(@Param('id') id: string) {
        return this.roleService.remove(id);
    }

    @Post(':id/permissions')
    @RequirePermissions('edit-roles')
    assignPermissions(@Param('id') id: string, @Body() assignPermissionsDto: AssignPermissionsDto) {
        return this.roleService.assignPermissions(id, assignPermissionsDto);
    }

    @Delete(':id/permissions')
    @RequirePermissions('edit-roles')
    removePermissions(@Param('id') id: string, @Body() removePermissionsDto: RemovePermissionsDto) {
        return this.roleService.removePermissions(id, removePermissionsDto);
    }
}
