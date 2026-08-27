import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Filtro global de excepciones.
 *
 * - 5xx: loggea el detalle completo server-side y devuelve un cuerpo genérico,
 *   sin stack traces ni URLs/puertos internos (M4).
 * - 4xx: reenvía intacto el cuerpo del error del microservicio downstream o de
 *   la validación (incluye `message`, `error` y códigos propios como `code`)
 *   para que el front pueda reaccionar de forma específica.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const base = { timestamp: new Date().toISOString(), path: request.url };

    if (status >= 500) {
      const detail =
        exception instanceof Error ? exception.stack || exception.message : exception;
      this.logger.error(`${request.method} ${request.url} -> ${status}: ${detail}`);
      response.status(status).json({
        statusCode: status,
        message: 'Internal server error',
        ...base,
      });
      return;
    }

    // 4xx — preservar el cuerpo del downstream / validación.
    let body: Record<string, unknown> = {
      statusCode: status,
      message: 'Request failed',
    };

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        body = { statusCode: status, message: res };
      } else if (res && typeof res === 'object') {
        body = { ...(res as Record<string, unknown>), statusCode: status };
      }
    } else if (exception instanceof Error && exception.message) {
      body = { statusCode: status, message: exception.message };
    }

    response.status(status).json({ ...body, ...base });
  }
}
