import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { um_PermissionEntity } from '../entities/um_permission.entity';
import { CreatePermissionDto, UpdatePermissionDto, PermissionQueryDto } from '../dtos/um_permission.dto';

@Injectable()
export class um_PermissionService {
    constructor(
        @InjectRepository(um_PermissionEntity)
        private readonly permissionRepository: Repository<um_PermissionEntity>,
    ) { }

    async create(createPermissionDto: CreatePermissionDto): Promise<um_PermissionEntity> {
        const permission = this.permissionRepository.create(createPermissionDto);
        return await this.permissionRepository.save(permission);
    }

    async findAll(query: PermissionQueryDto) {
        const { search, category, isActive, sortBy = 'created_at', sortOrder = 'DESC', page = '1', limit = '10' } = query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const where: any = {};

        if (search) {
            where.name = Like(`%${search}%`);
        }
        if (category) {
            where.category = category;
        }
        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        const [data, total] = await this.permissionRepository.findAndCount({
            where,
            order: { [sortBy]: sortOrder },
            skip,
            take: limitNum,
        });

        return {
            data,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        };
    }

    async findOne(id: string): Promise<um_PermissionEntity> {
        const permission = await this.permissionRepository.findOne({ where: { id } });
        if (!permission) {
            throw new NotFoundException(`Permission with ID ${id} not found`);
        }
        return permission;
    }

    async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<um_PermissionEntity> {
        const permission = await this.findOne(id);
        Object.assign(permission, updatePermissionDto);
        return await this.permissionRepository.save(permission);
    }

    async remove(id: string): Promise<void> {
        const permission = await this.findOne(id);
        await this.permissionRepository.remove(permission);
    }
}
