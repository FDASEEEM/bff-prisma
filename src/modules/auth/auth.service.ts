import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MicroserviceClient } from '../../infrastructure/microservice-client/microservice.client';

@Injectable()
export class AuthService {
  constructor(private readonly client: MicroserviceClient) {}

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
