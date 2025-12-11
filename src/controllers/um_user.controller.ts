import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { um_UserService } from '../services/um_user.service';
import { CreateUserDto, UpdateUserDto, UserQueryDto, ChangePasswordDto, ManageUserRolesDto } from '../dtos/um_user.dto';
import { JwtAuthGuard } from '../securities/jwt.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class um_UserController {
    constructor(private readonly userService: um_UserService) { }

    @Post()
    @RequirePermissions('create-users')
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    @RequirePermissions('view-users')
    findAll(@Query() query: UserQueryDto) {
        return this.userService.findAll(query);
    }

    @Get(':id')
    @RequirePermissions('view-users')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    @RequirePermissions('edit-users')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @RequirePermissions('delete-users')
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }

    @Post(':id/change-password')
    @RequirePermissions('edit-users')
    changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
        return this.userService.changePassword(id, changePasswordDto);
    }

    @Post(':id/roles')
    @RequirePermissions('edit-users')
    assignRoles(@Param('id') id: string, @Body() manageUserRolesDto: ManageUserRolesDto) {
        return this.userService.assignRoles(id, manageUserRolesDto);
    }

    @Delete(':id/roles')
    @RequirePermissions('edit-users')
    removeRoles(@Param('id') id: string, @Body() manageUserRolesDto: ManageUserRolesDto) {
        return this.userService.removeRoles(id, manageUserRolesDto);
    }
}
