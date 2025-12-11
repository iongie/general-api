import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto, ForgotPasswordDto } from '../dtos/auth.dto';
import { Public } from '../decorators/public.decorater';
import { JwtAuthGuard } from '../securities/jwt.guard';
import { RefreshJwtAuthGuard } from '../securities/refresh-jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Public()
    @UseGuards(RefreshJwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    refresh(@Request() req) {
        return this.authService.refreshTokens(req.user.sub, req.user.refreshToken);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('forgot-password')
    forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Request() req) {
        return this.authService.logout(req.user.userId);
    }
}
