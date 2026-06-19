import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { MicroserviceClient } from './microservice.client';
import { BadGatewayException } from '@nestjs/common';

describe('MicroserviceClient', () => {
  let client: MicroserviceClient;
  let httpService: any;
  let configService: any;

  const mockResponse = (data: any, status: number = 200) => ({
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {},
  });

  beforeEach(async () => {
    httpService = {
      request: jest.fn(),
    };

    configService = {
      get: jest.fn((key: string) => {
        const config: any = {
          USERS_SERVICE_URL: 'http://localhost:3001',
          ADMINPANEL_SERVICE_URL: 'http://localhost:3004',
          PERFIL_SERVICE_URL: 'http://localhost:3005',
          DOCS_SERVICE_URL: 'http://localhost:3000',
          CHAT_SERVICE_URL: 'http://localhost:3000',
        };
        return config[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MicroserviceClient,
        { provide: HttpService, useValue: httpService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    client = module.get<MicroserviceClient>(MicroserviceClient);
  });

  it('should be defined', () => {
    expect(client).toBeDefined();
  });

  describe('getBaseUrl', () => {
    it('should throw BadGatewayException if service URL not configured', async () => {
      configService.get.mockReturnValueOnce(undefined);
      await expect(client.get('users', '/test')).rejects.toThrow(BadGatewayException);
    });
  });

  describe('GET requests', () => {
    it('should make a GET request to the correct service', async () => {
      httpService.request.mockReturnValue(of(mockResponse({ data: 'test' })));

      const result = await client.get('users', '/api/test');

      expect(result).toEqual({ data: 'test' });
      expect(httpService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: 'http://localhost:3001/api/test',
        }),
      );
    });

    it('should pass query params', async () => {
      httpService.request.mockReturnValue(of(mockResponse({})));

      await client.get('users', '/api/test', { params: { page: 1, limit: 10 } });

      expect(httpService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { page: 1, limit: 10 },
        }),
      );
    });

    it('should pass auth token in headers', async () => {
      httpService.request.mockReturnValue(of(mockResponse({})));

      await client.get('users', '/api/test', { authToken: 'Bearer token123' });

      expect(httpService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer token123',
          }),
        }),
      );
    });
  });

  describe('POST requests', () => {
    it('should make a POST request with data', async () => {
      httpService.request.mockReturnValue(of(mockResponse({ id: 1 })));

      const result = await client.post('users', '/api/test', { name: 'Test' });

      expect(result).toEqual({ id: 1 });
      expect(httpService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          data: { name: 'Test' },
        }),
      );
    });
  });

  describe('PATCH requests', () => {
    it('should make a PATCH request with data', async () => {
      httpService.request.mockReturnValue(of(mockResponse({ updated: true })));

      const result = await client.patch('users', '/api/test/1', { name: 'Updated' });

      expect(result).toEqual({ updated: true });
      expect(httpService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PATCH',
        }),
      );
    });
  });

  describe('DELETE requests', () => {
    it('should make a DELETE request', async () => {
      httpService.request.mockReturnValue(of(mockResponse({ deleted: true })));

      const result = await client.delete('users', '/api/test/1');

      expect(result).toEqual({ deleted: true });
      expect(httpService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
        }),
      );
    });
  });

  describe('PUT requests', () => {
    it('should make a PUT request with data', async () => {
      httpService.request.mockReturnValue(of(mockResponse({ updated: true })));

      const result = await client.put('users', '/api/test/1', { name: 'Updated' });

      expect(result).toEqual({ updated: true });
      expect(httpService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          data: { name: 'Updated' },
        }),
      );
    });
  });

  describe('Error handling', () => {
    it('should throw BadGatewayException on network error', async () => {
      httpService.request.mockReturnValue(throwError(() => new Error('Network error')));

      await expect(client.get('users', '/api/test')).rejects.toThrow(BadGatewayException);
    });

    it('should not throw on 4xx responses (passed through)', async () => {
      httpService.request.mockReturnValue(of(mockResponse({ error: 'Not found' }, 404)));

      const result = await client.get('users', '/api/test');

      expect(result).toEqual({ error: 'Not found' });
    });

    it('should configure validateStatus to accept only status < 500', async () => {
      httpService.request.mockReturnValue(of(mockResponse({})));

      await client.get('users', '/api/test');

      const config = httpService.request.mock.calls[0][0];
      expect(config.validateStatus(404)).toBe(true);
      expect(config.validateStatus(500)).toBe(false);
    });
  });

  describe('URL construction', () => {
    it('should prepend / if path does not start with /', async () => {
      httpService.request.mockReturnValue(of(mockResponse({})));

      await client.get('users', 'api/test');

      expect(httpService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'http://localhost:3001/api/test',
        }),
      );
    });

    it('should not double prepend / if path starts with /', async () => {
      httpService.request.mockReturnValue(of(mockResponse({})));

      await client.get('users', '/api/test');

      expect(httpService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'http://localhost:3001/api/test',
        }),
      );
    });
  });
});
