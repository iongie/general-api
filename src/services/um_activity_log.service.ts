import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sm_ActivityLogEntity, ActivityType, ActivityStatus } from '../entities/um_activity_log.entity';
import { um_UserEntity } from '../entities/um_user.entity';

@Injectable()
export class um_ActivityLogService {
    constructor(
        @InjectRepository(sm_ActivityLogEntity)
        private readonly activityLogRepository: Repository<sm_ActivityLogEntity>,
    ) {}

    async createLog(data: {
        type: ActivityType;
        title: string;
        action: string;
        resource?: string;
        resourceId?: string;
        description?: string;
        oldValues?: any;
        newValues?: any;
        ipAddress?: string;
        userAgent?: string;
        user?: um_UserEntity;
        status?: ActivityStatus;
        errorMessage?: string;
    }): Promise<sm_ActivityLogEntity> {
        const log = this.activityLogRepository.create({
            type: data.type,
            action: data.action,
            resource: data.resource,
            resourceId: data.resourceId,
            description: data.description,
            oldValues: data.oldValues,
            newValues: data.newValues,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
            user: data.user,
            status: data.status || ActivityStatus.SUCCESS,
            errorMessage: data.errorMessage,
        });

        return await this.activityLogRepository.save(log);
    }
}
