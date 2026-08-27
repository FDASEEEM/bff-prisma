import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, BadGatewayException, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

export type ServiceName = 'users' | 'adminpanel' | 'perfil' | 'docs' | 'chat';

/**
 * Cliente HTTP genérico para consumir microservicios downstream.
 *
 * Reenvía el Authorization header tal cual; cada microservicio valida el JWT
 * de forma independiente vía JWKS. No confía en headers inyectables de gateway.
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
      isMultipart?: boolean;
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
        ...(options?.headers || {}),
      },
      validateStatus: () => true,
      // Permite reenviar archivos grandes (limite real lo aplica ms-docs).
      ...(options?.isMultipart
        ? { maxBodyLength: Infinity, maxContentLength: Infinity }
        : {}),
    };

    try {
      const response: AxiosResponse<T> = await firstValueFrom(this.httpService.request(config));

      if (response.status >= 500) {
        this.logger.error(
          `Microservice ${service} returned ${response.status}: ${JSON.stringify(response.data)}`,
        );
        throw new BadGatewayException(
          `Microservice ${service} is unavailable (${response.status})`,
        );
      }

      if (response.status >= 400) {
        this.logger.warn(
          `Microservice ${service} returned ${response.status}: ${JSON.stringify(response.data)}`,
        );
        // Propagate the real status to the client (NestJS serializes HttpException
        // with the correct HTTP code), so e.g. a 401 triggers the front's
        // session-expired handling instead of being swallowed as 200.
        throw new HttpException(response.data, response.status);
      }

      return response.data;
    } catch (error) {
      // Loggeamos el detalle completo (incl. URL/stack) server-side, pero nunca
      // lo exponemos al cliente para no filtrar URLs/puertos internos (M4).
      this.logger.error(
        `Error calling ${service} ${method} ${path}: ${(error as Error)?.stack || error}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadGatewayException(
        `Error communicating with ${service} service`,
      );
    }
  }

  // Convenience methods — el Authorization lo aporta el controller
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

  /**
   * Reenvia un cuerpo multipart/form-data (subida de archivos) al microservicio.
   * El `form` debe ser una instancia de `form-data`; sus headers (incluido el
   * boundary) se propagan tal cual.
   */
  postMultipart<T = any>(
    service: ServiceName,
    path: string,
    form: { getHeaders: () => Record<string, string> },
    options?: { authToken?: string },
  ): Promise<T> {
    return this.request<T>(service, 'POST', path, {
      data: form,
      headers: form.getHeaders(),
      authToken: options?.authToken,
      isMultipart: true,
    });
  }
}
