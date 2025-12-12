import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { um_UserService } from '../services/um_user.service';
import { CreateUserDto, UpdateUserDto, UserQueryDto, ChangePasswordDto, ManageUserRolesDto } from '../dtos/um_user.dto';
import { JwtAuthGuard } from '../securities/jwt.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';
import { ActivityLogInterceptor } from '../interceptors/activity-log.interceptor';
import { ActivityLog } from '../decorators/activity-log.decorator';
import { ActivityType } from '../entities/um_activity_log.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ActivityLogInterceptor)
export class um_UserController {
    constructor(private readonly userService: um_UserService) { }

    @Post()
    @RequirePermissions('create-users')
    @ActivityLog({ type: ActivityType.CREATE, action: 'Create User', resource: 'User' })
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
    @ActivityLog({ type: ActivityType.UPDATE, action: 'Update User', resource: 'User' })
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @RequirePermissions('delete-users')
    @ActivityLog({ type: ActivityType.DELETE, action: 'Delete User', resource: 'User' })
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }

    @Post(':id/change-password')
    @RequirePermissions('edit-users')
    @ActivityLog({ type: ActivityType.UPDATE, action: 'Change Password', resource: 'User' })
    changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
        return this.userService.changePassword(id, changePasswordDto);
    }

    @Post(':id/roles')
    @RequirePermissions('edit-users')
    @ActivityLog({ type: ActivityType.UPDATE, action: 'Assign Roles', resource: 'User' })
    assignRoles(@Param('id') id: string, @Body() manageUserRolesDto: ManageUserRolesDto) {
        return this.userService.assignRoles(id, manageUserRolesDto);
    }

    @Delete(':id/roles')
    @RequirePermissions('edit-users')
    @ActivityLog({ type: ActivityType.UPDATE, action: 'Remove Roles', resource: 'User' })
    removeRoles(@Param('id') id: string, @Body() manageUserRolesDto: ManageUserRolesDto) {
        return this.userService.removeRoles(id, manageUserRolesDto);
    }
}
