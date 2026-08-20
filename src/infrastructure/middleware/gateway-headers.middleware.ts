import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware que extrae headers de API Gateway (Cognito Authorizer)
 * y los adjunta al request para que los controllers puedan reenviarlos.
 *
 * Headers esperados del gateway:
 *   X-User-Id      → sub del JWT
 *   X-User-Email   → email del JWT
 *   X-User-Role    → custom:role del JWT
 *   X-Colegio-Id   → custom:colegioId del JWT
 *
 * En desarrollo local (sin gateway), estos headers no existen y el middleware
 * no hace nada — los services validan el JWT via JWKS como antes.
 */
@Injectable()
export class GatewayHeadersMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const gatewayHeaders: Record<string, string> = {};
    const headerNames = ['x-user-id', 'x-user-email', 'x-user-role', 'x-colegio-id'];

    for (const name of headerNames) {
      const value = req.headers[name];
      if (typeof value === 'string') {
        gatewayHeaders[name] = value;
      }
    }

    // Adjuntar al request para que los controllers lo accedan
    (req as any).gatewayHeaders = gatewayHeaders;
    next();
  }
}
