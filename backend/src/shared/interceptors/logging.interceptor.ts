import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WinstonLoggerService } from '../services/winston-logger.service';
import { Usuario } from '../../domain/entities/usuario.entity';

interface RequestWithUser extends Request {
  user?: Usuario;
}

/**
 * Interceptor de logging estruturado
 * Loga requisições HTTP com métricas de performance
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new WinstonLoggerService();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const method = request.method;
    const url = request.url;
    const userId = this.extractUserId(request.user);
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>();
        const duration = Date.now() - now;

        this.logger.logRequest(
          method,
          url,
          response.statusCode,
          duration,
          userId,
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
