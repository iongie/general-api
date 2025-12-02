import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { um_RoleEntity } from '../entities/um_role.entity';
import { um_PermissionEntity } from '../entities/um_permission.entity';
import { CreateRoleDto, UpdateRoleDto, RoleQueryDto, AssignPermissionsDto, RemovePermissionsDto } from '../dtos/um_role.dto';

@Injectable()
export class um_RoleService {
    constructor(
        @InjectRepository(um_RoleEntity)
        private readonly roleRepository: Repository<um_RoleEntity>,
        @InjectRepository(um_PermissionEntity)
        private readonly permissionRepository: Repository<um_PermissionEntity>,
    ) { }

    async create(createRoleDto: CreateRoleDto): Promise<um_RoleEntity> {
        const { permissionIds, ...roleData } = createRoleDto;
        const role = this.roleRepository.create(roleData);

        if (permissionIds && permissionIds.length > 0) {
            const permissions = await this.permissionRepository.findBy({ id: In(permissionIds) });
            role.permissions = permissions;
        }

        return await this.roleRepository.save(role);
    }

    async findAll(query: RoleQueryDto) {
        const { search, color, isActive, isSystem, sortBy = 'created_at', sortOrder = 'DESC', page = '1', limit = '10' } = query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const where: any = {};

        if (search) {
            where.name = Like(`%${search}%`);
        }
        if (color) {
            where.color = color;
        }
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        if (isSystem !== undefined) {
            where.isSystem = isSystem;
        }

        const [data, total] = await this.roleRepository.findAndCount({
            where,
            order: { [sortBy]: sortOrder },
            skip,
            take: limitNum,
            relations: ['permissions'],
        });

        return {
            data,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        };
    }

    async findOne(id: string): Promise<um_RoleEntity> {
        const role = await this.roleRepository.findOne({
            where: { id },
            relations: ['permissions']
        });
        if (!role) {
            throw new NotFoundException(`Role with ID ${id} not found`);
        }
        return role;
    }

    async update(id: string, updateRoleDto: UpdateRoleDto): Promise<um_RoleEntity> {
        const role = await this.findOne(id);
        const { permissionIds, ...roleData } = updateRoleDto;

        Object.assign(role, roleData);

        if (permissionIds) {
            const permissions = await this.permissionRepository.findBy({ id: In(permissionIds) });
            role.permissions = permissions;
        }

        return await this.roleRepository.save(role);
    }

    async remove(id: string): Promise<void> {
        const role = await this.findOne(id);
        await this.roleRepository.remove(role);
    }

    async assignPermissions(id: string, dto: AssignPermissionsDto): Promise<um_RoleEntity> {
        const role = await this.findOne(id);
        const permissions = await this.permissionRepository.findBy({ id: In(dto.permissionIds) });

        // Merge existing permissions with new ones, avoiding duplicates
        const existingPermissionIds = role.permissions.map(p => p.id);
        const newPermissions = permissions.filter(p => !existingPermissionIds.includes(p.id));

        role.permissions = [...role.permissions, ...newPermissions];
        return await this.roleRepository.save(role);
    }

    async removePermissions(id: string, dto: RemovePermissionsDto): Promise<um_RoleEntity> {
        const role = await this.findOne(id);
        role.permissions = role.permissions.filter(p => !dto.permissionIds.includes(p.id));
        return await this.roleRepository.save(role);
    }
}
