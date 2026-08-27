import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
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

  @Post('google/url')
  @ApiOperation({ summary: 'Obtener URL de autorización de Google' })
  async googleUrl(@Res({ passthrough: true }) res: Response) {
    const { url, state } = await this.authService.getGoogleAuthUrl();
    // Persistimos el state en un cookie HttpOnly + SameSite=Lax para validarlo
    // en el callback (login CSRF / inyección de authorization code).
    res.cookie('prisma_oauth_state', state, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 10 * 60 * 1000, // 10 min
      path: '/',
    });
    return { url };
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Callback de Google (intercambia code por sesión)' })
  async googleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const frontUrl = this.authService.getFrontUrl();
    try {
      // Rechazamos si el state del callback no coincide con el que emitimos y
      // guardamos en cookie (tiempo de vida corto). Esto impide login CSRF.
      const expectedState = this.readOauthStateCookie(req);
      res.clearCookie('prisma_oauth_state', { path: '/' });

      if (!expectedState || expectedState !== state) {
        return res.redirect(
          `${frontUrl}/auth/callback#error=${encodeURIComponent('Invalid OAuth state.')}`,
        );
      }

      const session = await this.authService.exchangeGoogleCode(code, state, expectedState);
      return res.redirect(this.authService.buildGoogleCallbackRedirect(session));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo completar el login con Google.';
      return res.redirect(
        `${frontUrl}/auth/callback#error=${encodeURIComponent(message)}`,
      );
    }
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

  private readOauthStateCookie(req: Request): string | undefined {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return undefined;
    const match = cookieHeader
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('prisma_oauth_state='));
    if (!match) return undefined;
    return decodeURIComponent(match.slice('prisma_oauth_state='.length));
  }
}
