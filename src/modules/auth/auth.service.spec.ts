import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { MicroserviceClient } from '../../infrastructure/microservice-client/microservice.client';

describe('AuthService', () => {
  let service: AuthService;
  let client: jest.Mocked<MicroserviceClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const values: Record<string, unknown> = {
                PORT: 3010,
                FRONT_URL: 'http://localhost:3002',
                GOOGLE_CALLBACK_URL: 'http://localhost:3010/api/auth/google/callback',
              };
              return values[key];
            }),
          },
        },
        {
          provide: MicroserviceClient,
          useValue: {
            post: jest.fn(),
            get: jest.fn(),
            patch: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    client = module.get(MicroserviceClient) as jest.Mocked<MicroserviceClient>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should call client.post with correct params', async () => {
      client.post.mockResolvedValue({ access_token: 'token', user: { id: '1' } });

      const result = await service.login('test@test.com', 'password');

      expect(client.post).toHaveBeenCalledWith('users', '/api/auth/login', {
        email: 'test@test.com',
        password: 'password',
      });
      expect(result).toEqual({ access_token: 'token', user: { id: '1' } });
    });
  });

  describe('register', () => {
    it('should call client.post with user data', async () => {
      const data = { email: 'test@test.com', password: 'pass', rut: '123', nombreCompleto: 'Test' };
      client.post.mockResolvedValue({ ok: true });

      await service.register(data);

      expect(client.post).toHaveBeenCalledWith('users', '/api/auth/register', data);
    });
  });

  describe('logout', () => {
    it('should call client.post with auth token', async () => {
      client.post.mockResolvedValue({ message: 'Logged out' });

      await service.logout('Bearer token123');

      expect(client.post).toHaveBeenCalledWith(
        'users',
        '/api/auth/logout',
        undefined,
        { authToken: 'Bearer token123' },
      );
    });
  });

  describe('refresh', () => {
    it('should call client.post with refresh token', async () => {
      client.post.mockResolvedValue({ access_token: 'new-token' });

      await service.refresh('refresh-token-123');

      expect(client.post).toHaveBeenCalledWith('users', '/api/auth/refresh', {
        refreshToken: 'refresh-token-123',
      });
    });
  });

  describe('me', () => {
    it('should call client.get with auth token', async () => {
      client.get.mockResolvedValue({ id: '1', email: 'test@test.com' });

      const result = await service.me('Bearer token123');

      expect(client.get).toHaveBeenCalledWith('users', '/api/auth/me', { authToken: 'Bearer token123' });
      expect(result).toEqual({ id: '1', email: 'test@test.com' });
    });
  });

  describe('updateMe', () => {
    it('should call client.patch with data and auth token', async () => {
      client.patch.mockResolvedValue({ updated: true });
      const data = { nombreCompleto: 'Updated' };

      await service.updateMe('Bearer token123', data);

      expect(client.patch).toHaveBeenCalledWith(
        'users',
        '/api/auth/me',
        data,
        { authToken: 'Bearer token123' },
      );
    });
  });

  describe('extractToken', () => {
    it('should extract bearer token', () => {
      const token = service.extractToken('Bearer abc123');
      expect(token).toBe('abc123');
    });

    it('should throw UnauthorizedException if no header', () => {
      expect(() => service.extractToken(undefined)).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if invalid scheme', () => {
      expect(() => service.extractToken('Basic abc123')).toThrow(UnauthorizedException);
    });
  });

  describe('extractAuthHeader', () => {
    it('should return the authorization header as-is', () => {
      const result = service.extractAuthHeader('Bearer abc123');
      expect(result).toBe('Bearer abc123');
    });

    it('should throw UnauthorizedException if no header', () => {
      expect(() => service.extractAuthHeader(undefined)).toThrow(UnauthorizedException);
    });
  });

  describe('getGoogleAuthUrl', () => {
    it('should ask ms-users for the Google URL using the BFF callback', async () => {
      client.post.mockResolvedValue({ url: 'https://google.com/auth', state: 'pkce-state' });

      const result = await service.getGoogleAuthUrl();

      expect(client.post).toHaveBeenCalledWith('users', '/api/auth/google/url', {
        redirectTo: 'http://localhost:3010/api/auth/google/callback',
      });
      expect(result).toEqual({ url: 'https://google.com/auth', state: 'pkce-state' });
    });
  });

  describe('exchangeGoogleCode', () => {
    it('should forward code/state to ms-users and return the session', async () => {
      const session = { access_token: 'access', refresh_token: 'refresh', expires_in: 3600, user: { id: '1' } };
      client.post.mockResolvedValue(session);

      const result = await service.exchangeGoogleCode('code', 'state');

      expect(client.post).toHaveBeenCalledWith('users', '/api/auth/google/callback', {
        code: 'code',
        state: 'state',
      });
      expect(result).toEqual(session);
    });

    it('should throw UnauthorizedException when no access_token is returned', async () => {
      client.post.mockResolvedValue({ message: 'Invalid code' });

      await expect(service.exchangeGoogleCode('code', 'state')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('buildGoogleCallbackRedirect', () => {
    it('should build a front URL with tokens in the fragment', () => {
      const session = {
        access_token: 'access',
        refresh_token: 'refresh',
        expires_in: 3600,
        user: { id: '1', role: 'TEACHER' },
      };

      const url = service.buildGoogleCallbackRedirect(session);

      expect(url).toMatch(/^http:\/\/localhost:3002\/auth\/callback#/);
      expect(url).toContain('access_token=access');
      expect(url).toContain('refresh_token=refresh');
      expect(url).toContain('expires_in=3600');
      expect(url).toContain('user=');
    });
  });
});
