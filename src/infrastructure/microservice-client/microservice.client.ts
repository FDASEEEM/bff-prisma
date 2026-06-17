import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, BadGatewayException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

export type ServiceName = 'users' | 'adminpanel' | 'perfil' | 'docs' | 'chat';

/**
 * Cliente HTTP genérico para consumir microservicios downstream.
 *
 * IMPORTANTE: Este cliente NO valida JWTs. Solo reenvía el header `Authorization`
 * recibido del frontend al microservicio correspondiente. La validación de
 * autenticación y autorización ocurre en cada microservicio (SupabaseAuthGuard +
 * RolesGuard). Ver README.md sección "Seguridad y autorización" para detalles.
 */

@Injectable()
export class MicroserviceClient {
  private readonly logger = new Logger(MicroserviceClient.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private getBaseUrl(service: ServiceName): string {
    const key = `${service.toUpperCase()}_SERVICE_URL`;
    const url = this.configService.get<string>(key);
    if (!url) {
      throw new BadGatewayException(`${key} is not configured`);
    }
    return url;
  }

  async request<T = any>(
    service: ServiceName,
    method: string,
    path: string,
    options?: {
      data?: any;
      params?: any;
      headers?: Record<string, string>;
      authToken?: string;
    },
  ): Promise<T> {
    const baseUrl = this.getBaseUrl(service);
    const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

    const config: AxiosRequestConfig = {
      method,
      url,
      data: options?.data,
      params: options?.params,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.authToken ? { Authorization: options.authToken } : {}),
        ...(options?.headers || {}),
      },
      validateStatus: (status) => status < 500,
    };

    try {
      const response: AxiosResponse<T> = await firstValueFrom(this.httpService.request(config));
      
      if (response.status >= 400) {
        this.logger.warn(`Microservice ${service} returned ${response.status}: ${JSON.stringify(response.data)}`);
      }
      
      return response.data;
    } catch (error) {
      this.logger.error(`Error calling ${service} ${method} ${path}: ${error.message}`);
      throw new BadGatewayException(
        `Error communicating with ${service} service: ${error.message}`,
      );
    }
  }

  // Convenience methods
  get<T = any>(service: ServiceName, path: string, options?: { params?: any; authToken?: string }): Promise<T> {
    return this.request<T>(service, 'GET', path, options);
  }

  post<T = any>(service: ServiceName, path: string, data?: any, options?: { authToken?: string }): Promise<T> {
    return this.request<T>(service, 'POST', path, { data, ...options });
  }

  patch<T = any>(service: ServiceName, path: string, data?: any, options?: { authToken?: string }): Promise<T> {
    return this.request<T>(service, 'PATCH', path, { data, ...options });
  }

  delete<T = any>(service: ServiceName, path: string, options?: { authToken?: string }): Promise<T> {
    return this.request<T>(service, 'DELETE', path, options);
  }

  put<T = any>(service: ServiceName, path: string, data?: any, options?: { authToken?: string }): Promise<T> {
    return this.request<T>(service, 'PUT', path, { data, ...options });
  }
}
