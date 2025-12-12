import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { um_ActivityLogService } from '../services/um_activity_log.service';
import { ACTIVITY_LOG_KEY, ActivityLogMetadata } from '../decorators/activity-log.decorator';
import { ActivityStatus, ActivityType } from '../entities/um_activity_log.entity';

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
    private readonly logger = new Logger(ActivityLogInterceptor.name);

    constructor(
        private reflector: Reflector,
        private activityLogService: um_ActivityLogService,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const metadata = this.reflector.get<ActivityLogMetadata>(ACTIVITY_LOG_KEY, context.getHandler());

        if (!metadata) {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest();
        const { user, ip, headers, params, body } = request;
        const userAgent = headers['user-agent'];

        return next.handle().pipe(
            tap({
                next: async (data) => {
                    try {
                        let resourceId = processingResourceId(metadata.type, params, data);
                        
                        // If checking oldValues/newValues is required, it would be more complex.
                        // For now we log input body as newValues (for create/update).
                        
                        let newValues = null;
                         if (metadata.type === ActivityType.CREATE || metadata.type === ActivityType.UPDATE) {
                            newValues = body;
                         }

                        await this.activityLogService.createLog({
                            type: metadata.type,
                            title: metadata.action, // mapping action to title if needed or vice versa
                            action: metadata.action,
                            resource: metadata.resource,
                            resourceId: resourceId?.toString(),
                            description: metadata.description,
                            newValues: newValues,
                            ipAddress: ip,
                            userAgent: userAgent,
                            user: user ? ({ id: user.userId } as any) : null,
                            status: ActivityStatus.SUCCESS,
                        });
                    } catch (error) {
                        this.logger.error('Failed to create activity log', error.stack);
                    }
                },
                error: async (error) => {
                     try {
                        let resourceId = processingResourceId(metadata.type, params, null);

                        await this.activityLogService.createLog({
                            type: metadata.type,
                            title: metadata.action,
                            action: metadata.action,
                            resource: metadata.resource,
                            resourceId: resourceId?.toString(),
                            description: metadata.description,
                            ipAddress: ip,
                            userAgent: userAgent,
                            user: user ? ({ id: user.userId } as any) : null,
                            status: ActivityStatus.FAILED,
                            errorMessage: error.message,
                        });
                    } catch (loggingError) {
                        this.logger.error('Failed to create error activity log', loggingError.stack);
                    }
                }
            }),
        );
    }
}

function processingResourceId(type: ActivityType, params: any, data: any): any {
    if (params && params.id) {
        return params.id;
    }
    if (type === ActivityType.CREATE && data && data.id) {
        return data.id;
    }
    return null;
}
