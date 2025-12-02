import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { um_RoleService } from '../services/um_role.service';
import { CreateRoleDto, UpdateRoleDto, RoleQueryDto, AssignPermissionsDto, RemovePermissionsDto } from '../dtos/um_role.dto';

@Controller('roles')
export class um_RoleController {
    constructor(private readonly roleService: um_RoleService) { }

    @Post()
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.roleService.create(createRoleDto);
    }

    @Get()
    findAll(@Query() query: RoleQueryDto) {
        return this.roleService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.roleService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
        return this.roleService.update(id, updateRoleDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.roleService.remove(id);
    }

    @Post(':id/permissions')
    assignPermissions(@Param('id') id: string, @Body() assignPermissionsDto: AssignPermissionsDto) {
        return this.roleService.assignPermissions(id, assignPermissionsDto);
    }

    @Delete(':id/permissions')
    removePermissions(@Param('id') id: string, @Body() removePermissionsDto: RemovePermissionsDto) {
        return this.roleService.removePermissions(id, removePermissionsDto);
    }
}
