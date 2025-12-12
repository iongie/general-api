import { SetMetadata } from '@nestjs/common';
import { ActivityType } from '../entities/um_activity_log.entity';

export const ACTIVITY_LOG_KEY = 'activity_log';

export interface ActivityLogMetadata {
  type: ActivityType;
  action: string;
  resource?: string;
  description?: string;
}

export const ActivityLog = (metadata: ActivityLogMetadata) => SetMetadata(ACTIVITY_LOG_KEY, metadata);
