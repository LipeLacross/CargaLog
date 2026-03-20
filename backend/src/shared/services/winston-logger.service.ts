import { LoggerService, Logger } from '@nestjs/common';

/**
 * Substituição do serviço que antes usava Winston.
 * Agora usa o Logger embutido do NestJS para reduzir dependências.
 */
export class WinstonLoggerService implements LoggerService {
  private logger = new Logger('WinstonLoggerService');

  log(message: string, context?: string) {
    this.logger.log(message, context);
  }

  error(message: string, trace?: string, _context?: string) {
    this.logger.error(message, trace);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, context);
  }

  verbose(message: string, context?: string) {
    this.logger.log(message, context);
  }

  logWithMeta(level: string, message: string, meta: Record<string, unknown>) {
    this.logger.log(
      `${level.toUpperCase()} ${message} ${JSON.stringify(meta)}`,
    );
  }

  logRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    userId?: string,
  ) {
    this.logger.log(
      `${method} ${url} ${statusCode} ${duration}ms - user:${userId}`,
      'HttpRequest',
    );
  }

  logError(error: Error, _context?: string) {
    this.logger.error(error.message, error.stack);
  }
}
