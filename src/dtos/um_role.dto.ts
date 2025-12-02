import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber, MinLength, MaxLength, IsArray } from 'class-validator';
import { RoleColor } from '../entities/um_role.entity';
import { IsULIDArray } from 'src/validators/ulid.validator';

export class CreateRoleDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  slug: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEnum(RoleColor)
  color?: RoleColor;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;

  @IsOptional()
  @IsArray()
  @IsULIDArray()
  permissionIds?: string[];
}

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEnum(RoleColor)
  color?: RoleColor;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;

  @IsOptional()
  @IsArray()
  @IsULIDArray()
  permissionIds?: string[];
}

export class RoleResponseDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: RoleColor;
  sortOrder: number;
  isActive: boolean;
  isSystem: boolean;
  permissions: any[];
  userCount: number;
  dibuat: Date;
  diubah: Date;
}

export class AssignPermissionsDto {
  @IsArray()
  @IsULIDArray()
  permissionIds: string[];
}

export class RemovePermissionsDto {
  @IsArray()
  @IsULIDArray()
  permissionIds: string[];
}

export class RoleQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(RoleColor)
  color?: RoleColor;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
