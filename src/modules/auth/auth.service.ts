import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceClient } from '../../infrastructure/microservice-client/microservice.client';

@Injectable()
export class AuthService {
  constructor(
    private readonly client: MicroserviceClient,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, password: string) {
    return this.client.post('users', '/api/auth/login', { email, password });
  }

  async register(data: { email: string; password: string; rut: string; nombreCompleto: string; [key: string]: any }) {
    return this.client.post('users', '/api/auth/register', data);
  }

  async logout(authToken: string) {
    return this.client.post('users', '/api/auth/logout', undefined, { authToken });
  }

  async refresh(refreshToken: string) {
    return this.client.post('users', '/api/auth/refresh', { refreshToken });
  }

  async me(authToken: string) {
    return this.client.get('users', '/api/auth/me', { authToken });
  }

  async updateMe(authToken: string, data: any) {
    return this.client.patch('users', '/api/auth/me', data, { authToken });
  }

  async getGoogleAuthUrl() {
    const redirectTo = this.getGoogleCallbackUrl();
    return this.client.post('users', '/api/auth/google/url', { redirectTo });
  }

  async exchangeGoogleCode(code: string, state: string, expectedState?: string) {
    const session = await this.client.post('users', '/api/auth/google/callback', {
      code,
      state,
      ...(expectedState ? { expectedState } : {}),
    });

    if (!session || !session.access_token) {
      throw new UnauthorizedException(
        session?.message || 'No se pudo completar el login con Google.',
      );
    }

    return session;
  }

  getFrontUrl(): string {
    return this.configService.get<string>('FRONT_URL') || 'http://localhost:3002';
  }

  buildGoogleCallbackRedirect(session: any): string {
    const frontUrl = this.getFrontUrl();
    const user = encodeURIComponent(JSON.stringify(session.user ?? {}));
    return (
      `${frontUrl}/auth/callback` +
      `#access_token=${encodeURIComponent(session.access_token)}` +
      `&refresh_token=${encodeURIComponent(session.refresh_token)}` +
      `&expires_in=${session.expires_in}` +
      `&user=${user}`
    );
  }

  getGoogleCallbackUrl(): string {
    const port = this.configService.get<number>('PORT') || 3010;
    return (
      this.configService.get<string>('GOOGLE_CALLBACK_URL') ||
      `http://localhost:${port}/api/auth/google/callback`
    );
  }

  extractToken(authorization?: string): string {
    if (!authorization) {
      throw new UnauthorizedException('Authorization header is required');
    }
    const [scheme, token] = authorization.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Invalid Authorization header');
    }
    return token;
  }

  extractAuthHeader(authorization?: string): string {
    if (!authorization) {
      throw new UnauthorizedException('Authorization header is required');
    }
    return authorization;
  }
}
