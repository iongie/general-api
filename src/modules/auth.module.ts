import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../securities/jwt.strategy';
import { RefreshJwtStrategy } from '../securities/refresh-jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { um_UserEntity } from '../entities/um_user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([um_UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRATION_TIME') || '3600s') as any,
        },
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    RefreshJwtStrategy,
    AuthService,
  ],
  exports: [JwtModule, AuthService],
})
export class AuthModule { }
