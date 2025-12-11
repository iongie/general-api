import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './providers/database.provider';
import { RateLimitProvider } from './providers/rate-limit.provider';
import { JwtAuthGuard } from './securities/jwt.guard';
import { PermissionsGuard } from './securities/permissions.guard';
import { ThrottlerConfigService } from './services/throller-config.service';
import { AuthModule } from './modules/auth.module';
import { UmModule } from './modules/um.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ThrottlerConfigService,
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: TypeOrmConfigService.useFactory,
      inject: [ConfigService],
    }),
    // Import all modules
    AuthModule,
    UmModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ThrottlerConfigService,
    RateLimitProvider,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule { }
