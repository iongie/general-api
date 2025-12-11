import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { um_UserEntity } from '../entities/um_user.entity';
import { um_RoleEntity } from '../entities/um_role.entity';
import { CreateUserDto, UpdateUserDto, UserQueryDto, ChangePasswordDto, ManageUserRolesDto } from '../dtos/um_user.dto';

@Injectable()
export class um_UserService {
    constructor(
        @InjectRepository(um_UserEntity)
        private readonly userRepository: Repository<um_UserEntity>,
        @InjectRepository(um_RoleEntity)
        private readonly roleRepository: Repository<um_RoleEntity>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<um_UserEntity> {
        const { roleIds, password, ...userData } = createUserDto;

        const existingUser = await this.userRepository.findOne({
            where: [
                { email: userData.email },
                { username: userData.username }
            ]
        });

        if (existingUser) {
            throw new ConflictException('Email or Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            ...userData,
            password: hashedPassword,
        });

        if (roleIds && roleIds.length > 0) {
            const roles = await this.roleRepository.findBy({ id: In(roleIds) });
            user.roles = roles;
        }

        return await this.userRepository.save(user);
    }

    async findAll(query: UserQueryDto) {
        const { search, status, roleId, sortBy = 'created_at', sortOrder = 'DESC', page = '1', limit = '10' } = query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const where: any = {};

        if (search) {
            where.username = Like(`%${search}%`);
            // Or search by email, firstName, etc.
        }
        if (status) {
            where.status = status;
        }
        if (roleId) {
            where.roles = { id: roleId };
        }

        const [data, total] = await this.userRepository.findAndCount({
            where,
            order: { [sortBy]: sortOrder },
            skip,
            take: limitNum,
            relations: ['roles'],
        });

        return {
            data,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        };
    }

    async findOne(id: string): Promise<um_UserEntity> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['roles']
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async findByIdWithPermissions(id: string): Promise<um_UserEntity> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['roles', 'roles.permissions']
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<um_UserEntity> {
        const user = await this.findOne(id);
        const { roleIds, password, ...userData } = updateUserDto;

        Object.assign(user, userData);

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        if (roleIds) {
            const roles = await this.roleRepository.findBy({ id: In(roleIds) });
            user.roles = roles;
        }

        return await this.userRepository.save(user);
    }

    async remove(id: string): Promise<void> {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
    }

    async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void> {
        const user = await this.findOne(id);
        user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
        await this.userRepository.save(user);
    }

    async assignRoles(id: string, dto: ManageUserRolesDto): Promise<um_UserEntity> {
        const user = await this.findOne(id);
        const roles = await this.roleRepository.findBy({ id: In(dto.roleIds) });

        const existingRoleIds = user.roles.map(r => r.id);
        const newRoles = roles.filter(r => !existingRoleIds.includes(r.id));

        user.roles = [...user.roles, ...newRoles];
        return await this.userRepository.save(user);
    }

    async removeRoles(id: string, dto: ManageUserRolesDto): Promise<um_UserEntity> {
        const user = await this.findOne(id);
        user.roles = user.roles.filter(r => !dto.roleIds.includes(r.id));
        return await this.userRepository.save(user);
    }
}
