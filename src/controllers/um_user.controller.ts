import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { um_UserService } from '../services/um_user.service';
import { CreateUserDto, UpdateUserDto, UserQueryDto, ChangePasswordDto, ManageUserRolesDto } from '../dtos/um_user.dto';

@Controller('users')
export class um_UserController {
    constructor(private readonly userService: um_UserService) { }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    findAll(@Query() query: UserQueryDto) {
        return this.userService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }

    @Post(':id/change-password')
    changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
        return this.userService.changePassword(id, changePasswordDto);
    }

    @Post(':id/roles')
    assignRoles(@Param('id') id: string, @Body() manageUserRolesDto: ManageUserRolesDto) {
        return this.userService.assignRoles(id, manageUserRolesDto);
    }

    @Delete(':id/roles')
    removeRoles(@Param('id') id: string, @Body() manageUserRolesDto: ManageUserRolesDto) {
        return this.userService.removeRoles(id, manageUserRolesDto);
    }
}
