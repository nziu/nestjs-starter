import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { Public } from '../common/decorator/public.decorator';
import { AuthService } from './auth.service';
import { LoginInput, RefreshTokenInput } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Public()
  @Post('register')
  async register(@Body() loginInput: LoginInput) {
    return this.authService.register(loginInput);
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() { refresh_token }: RefreshTokenInput) {
    return this.authService.refreshToken(refresh_token);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
