import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, BadGatewayException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';

export type ServiceName = 'users' | 'adminpanel' | 'perfil' | 'docs' | 'chat';

/**
 * Cliente HTTP genérico para consumir microservicios downstream.
 *
 * Cuando API Gateway valida el JWT (Cognito Authorizer), agrega headers
 * con los claims del usuario: X-User-Id, X-User-Email, X-User-Role, X-Colegio-Id.
 * Este cliente los extrae del request y los reenvía a los microservicios.
 *
 * Si no hay headers de gateway (desarrollo local), reenvía el Authorization
 * header tal cual y los downstream validan el JWT via JWKS.
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

  /**
   * Extrae headers de gateway (API Gateway Cognito Authorizer) del request.
   * Si el gateway validó el JWT, estos headers contienen los claims.
   */
  extractGatewayHeaders(req?: Request): Record<string, string> {
    if (!req?.headers) return {};
    const gatewayHeaders: Record<string, string> = {};
    const gatewayHeaderNames = ['x-user-id', 'x-user-email', 'x-user-role', 'x-colegio-id'];
    for (const name of gatewayHeaderNames) {
      const value = req.headers[name];
      if (typeof value === 'string') {
        gatewayHeaders[name] = value;
      }
    }
    return gatewayHeaders;
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
      isMultipart?: boolean;
      gatewayHeaders?: Record<string, string>;
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
        // En multipart el Content-Type (con boundary) lo aportan los headers
        // del form-data; no forzamos application/json.
        ...(options?.isMultipart ? {} : { 'Content-Type': 'application/json' }),
        ...(options?.authToken ? { Authorization: options.authToken } : {}),
        // Headers de gateway (API Gateway Cognito Authorizer)
        ...(options?.gatewayHeaders || {}),
        ...(options?.headers || {}),
      },
      validateStatus: (status) => status < 500,
      // Permite reenviar archivos grandes (limite real lo aplica ms-docs).
      ...(options?.isMultipart
        ? { maxBodyLength: Infinity, maxContentLength: Infinity }
        : {}),
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

  // Convenience methods — gatewayHeaders se extraen del request del controller
  get<T = any>(service: ServiceName, path: string, options?: { params?: any; authToken?: string; gatewayHeaders?: Record<string, string> }): Promise<T> {
    return this.request<T>(service, 'GET', path, options);
  }

  post<T = any>(service: ServiceName, path: string, data?: any, options?: { authToken?: string; gatewayHeaders?: Record<string, string> }): Promise<T> {
    return this.request<T>(service, 'POST', path, { data, ...options });
  }

  patch<T = any>(service: ServiceName, path: string, data?: any, options?: { authToken?: string; gatewayHeaders?: Record<string, string> }): Promise<T> {
    return this.request<T>(service, 'PATCH', path, { data, ...options });
  }

  delete<T = any>(service: ServiceName, path: string, options?: { authToken?: string; gatewayHeaders?: Record<string, string> }): Promise<T> {
    return this.request<T>(service, 'DELETE', path, options);
  }

  put<T = any>(service: ServiceName, path: string, data?: any, options?: { authToken?: string; gatewayHeaders?: Record<string, string> }): Promise<T> {
    return this.request<T>(service, 'PUT', path, { data, ...options });
  }

  /**
   * Reenvia un cuerpo multipart/form-data (subida de archivos) al microservicio.
   * El `form` debe ser una instancia de `form-data`; sus headers (incluido el
   * boundary) se propagan tal cual.
   */
  postMultipart<T = any>(
    service: ServiceName,
    path: string,
    form: { getHeaders: () => Record<string, string> },
    options?: { authToken?: string; gatewayHeaders?: Record<string, string> },
  ): Promise<T> {
    return this.request<T>(service, 'POST', path, {
      data: form,
      headers: form.getHeaders(),
      authToken: options?.authToken,
      gatewayHeaders: options?.gatewayHeaders,
      isMultipart: true,
    });
  }
}
