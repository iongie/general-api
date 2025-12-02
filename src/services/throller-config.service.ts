import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions, ThrottlerOptionsFactory } from '@nestjs/throttler';

@Injectable()
export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  constructor(private configService: ConfigService) {}

  createThrottlerOptions(): ThrottlerModuleOptions {
    return {
      throttlers: [
        {
          ttl: this.configService.get('THROTTLE_TTL', 60), // Time-to-live in seconds
          limit: this.configService.get('THROTTLE_LIMIT', 10), // Number of maximum requests per TTL
        },
      ],
    };
  }
} 