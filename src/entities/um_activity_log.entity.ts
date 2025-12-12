import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CoreEntity } from './core.entity';
import { um_UserEntity } from './um_user.entity';

export enum ActivityType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  DOWNLOAD = 'download',
  UPLOAD = 'upload',
  EXPORT = 'export',
  IMPORT = 'import',
}

export enum ActivityStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
}

@Entity('activity_logs')
export class sm_ActivityLogEntity extends CoreEntity {
  @Column({ type: 'enum', enum: ActivityType })
  type: ActivityType;

  @Column({
    type: 'enum',
    enum: ActivityStatus,
    default: ActivityStatus.SUCCESS,
  })
  status: ActivityStatus;

  @Column()
  action: string;

  @Column({ nullable: true })
  resource: string;

  @Column({ nullable: true })
  resourceId: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('json', { nullable: true })
  oldValues: any;

  @Column('json', { nullable: true })
  newValues: any;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  sessionId: string;

  @Column({ nullable: true })
  errorMessage: string;

  @ManyToOne(() => um_UserEntity, (user) => user.activityLogs, {
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user: um_UserEntity;
}
