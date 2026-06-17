import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
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
});
