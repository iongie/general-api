import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { um_PermissionService } from '../services/um_permission.service';
import { CreatePermissionDto, UpdatePermissionDto, PermissionQueryDto } from '../dtos/um_permission.dto';

@Controller('permissions')
export class um_PermissionController {
    constructor(private readonly permissionService: um_PermissionService) { }

    @Post()
    create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionService.create(createPermissionDto);
    }

    @Get()
    findAll(@Query() query: PermissionQueryDto) {
        return this.permissionService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.permissionService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
        return this.permissionService.update(id, updatePermissionDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.permissionService.remove(id);
    }
}
