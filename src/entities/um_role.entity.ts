import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { CoreEntity } from './core.entity';
import { um_PermissionEntity } from './um_permission.entity';
import { um_UserEntity } from './um_user.entity';

export enum RoleColor {
  BLUE = 'blue',
  GREEN = 'green',
  RED = 'red',
  YELLOW = 'yellow',
  PURPLE = 'purple',
  PINK = 'pink',
  INDIGO = 'indigo',
  GRAY = 'gray'
}

@Entity('roles')
export class um_RoleEntity extends CoreEntity {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: RoleColor, default: RoleColor.BLUE })
  color: RoleColor;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isSystem: boolean;

  @ManyToMany(() => um_UserEntity, user => user.roles)
  users: um_UserEntity[];

  @ManyToMany(() => um_PermissionEntity, permission => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'roleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' }
  })
  permissions: um_PermissionEntity[];
}
