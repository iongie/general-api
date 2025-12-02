import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const RateLimitProvider: Provider = {
  provide: 'THROTTLER_OPTIONS',
  useFactory: (configService: ConfigService): ThrottlerModuleOptions => ({
    throttlers: [
      {
        ttl: configService.get('THROTTLE_TTL', 60),
        limit: configService.get('THROTTLE_LIMIT', 10),
      },
    ],
  }),
  inject: [ConfigService],
}; 