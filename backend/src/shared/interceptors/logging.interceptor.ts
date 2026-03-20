import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';
import { Usuario } from '../../domain/entities/usuario.entity';

interface RequestWithUser {
  method: string;
  url: string;
  user?: Usuario;
  [key: string]: any;
}

/**
 * Interceptor de logging estruturado
 * Loga requisições HTTP com métricas de performance
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>();
        const duration = Date.now() - now;

        // Log HTTP request using Nest Logger
        this.logger.log(
          `${method} ${url} ${response.statusCode} ${duration}ms`,
          'HttpRequest',
        );
      }),
    );
  }

  private extractUserId(user: unknown): string {
    if (typeof user === 'object' && user !== null && 'id' in user) {
      const id = (user as { id?: unknown }).id;
      if (typeof id === 'string' || typeof id === 'number') {
        return String(id);
      }
    }

    return 'anonymous';
  }
}
