import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WinstonLoggerService } from '../services/winston-logger.service';

/**
 * Interceptor de logging estruturado
 * Loga requisições HTTP com métricas de performance
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new WinstonLoggerService();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const userId = request.user?.id || 'anonymous';
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
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
}
