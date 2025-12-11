import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { um_UserEntity } from '../entities/um_user.entity';
import { LoginDto } from '../dtos/auth.dto';
import { ulid } from 'ulid';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(um_UserEntity)
        private userRepository: Repository<um_UserEntity>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async login(loginDto: LoginDto) {
        const user = await this.userRepository.findOne({
            where: { username: loginDto.username },
            relations: ['roles', 'roles.permissions']
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.status !== 'active') {
            throw new UnauthorizedException('User is not active');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.getTokens(user.id, user.username, user.email, user.roles.map(r => r.slug));
        await this.updateRefreshToken(user.id, tokens.refresh_token);

        const permissions = user.roles.flatMap(role => role.permissions.map(p => p.slug));
        const roles = user.roles.map(r => r.slug);

        return {
            ...tokens,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                roles: roles,
                permissions: permissions
            }
        };
    }

    async getTokens(userId: string, username: string, email: string, roles: string[]) {
        const payload = {
            sub: userId,
            username: username,
            email: email,
            roles: roles,
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: (this.configService.get<string>('JWT_EXPIRATION_TIME') || '15m') as any,
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'your-refresh-secret-backup',
                expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME') || '7d') as any,
            }),
        ]);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.update({ id: userId }, { hashedRefreshToken });
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['roles']
        });

        if (!user || !user.hashedRefreshToken)
            throw new UnauthorizedException('Access Denied');

        const refreshTokenMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
        if (!refreshTokenMatches)
            throw new UnauthorizedException('Access Denied');

        const roles = user.roles.map(r => r.slug);
        const tokens = await this.getTokens(user.id, user.username, user.email, roles);
        await this.updateRefreshToken(user.id, tokens.refresh_token);

        return tokens;
    }

    async forgotPassword(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException('User with this email does not exist');
        }

        const resetToken = ulid();
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 hour expiration

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = resetTokenExpiry;

        await this.userRepository.save(user);

        // In a real application, send email here.
        // For now, return the token for testing purposes if needed, or just a success message.
        return {
            message: 'If the email exists, a reset instruction has been sent.',
            // dev_token: resetToken // Uncomment for development/testing if user requests
        };
    }

    async logout(userId: string) {
        // We use update instead of save for partial update and avoiding relation issues if any
        await this.userRepository.update({ id: userId }, { hashedRefreshToken: null as any });
        return { message: 'Logged out successfully' };
    }
}
