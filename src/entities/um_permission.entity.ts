import { Entity, Column, ManyToMany } from 'typeorm';
import { CoreEntity } from './core.entity';
import { um_RoleEntity } from './um_role.entity';

export enum PermissionCategory {
  ALL_Management = 'all_management',
}

@Entity('permissions')
export class um_PermissionEntity extends CoreEntity {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  displayName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: PermissionCategory })
  category: PermissionCategory;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => um_RoleEntity, role => role.permissions)
  roles: um_RoleEntity[];
}
