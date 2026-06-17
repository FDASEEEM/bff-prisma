import { Body, Controller, Get, Headers, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login de usuario' })
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registro de docente' })
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refrescar token' })
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión' })
  async logout(@Headers('authorization') authorization: string) {
    const authHeader = this.authService.extractAuthHeader(authorization);
    return this.authService.logout(authHeader);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  async me(@Headers('authorization') authorization: string) {
    const authHeader = this.authService.extractAuthHeader(authorization);
    return this.authService.me(authHeader);
  }

  @Patch('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar perfil del usuario autenticado' })
  async updateMe(@Headers('authorization') authorization: string, @Body() body: any) {
    const authHeader = this.authService.extractAuthHeader(authorization);
    return this.authService.updateMe(authHeader, body);
  }
}
