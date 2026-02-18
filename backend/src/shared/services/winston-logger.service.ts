import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';

/**
 * Serviço de logging estruturado usando Winston
 * Suporta múltiplos transportes e níveis de log
 */
export class WinstonLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    const isPrimitive = (
      value: unknown,
    ): value is string | number | boolean | bigint | symbol => {
      const valueType = typeof value;
      return (
        valueType === 'string' ||
        valueType === 'number' ||
        valueType === 'boolean' ||
        valueType === 'bigint' ||
        valueType === 'symbol'
      );
    };

    const formatContext = (value: unknown): string => {
      if (value === null || value === undefined) {
        return '';
      }
      if (typeof value === 'string') {
        return value;
      }
      if (typeof value === 'object') {
        try {
          const jsonValue = JSON.stringify(value);
          return jsonValue ?? '[unserializable]';
        } catch {
          return '[unserializable]';
        }
      }
      return isPrimitive(value) ? String(value) : '[unserializable]';
    };

    const toLogString = (value: unknown): string => {
      if (value === null || value === undefined) {
        return '';
      }
      if (typeof value === 'string') {
        return value;
      }
      if (typeof value === 'object') {
        try {
          const jsonValue = JSON.stringify(value);
          return jsonValue ?? '[unserializable]';
        } catch {
          return '[unserializable]';
        }
      }
      return isPrimitive(value) ? String(value) : '[unserializable]';
    };

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),
      defaultMeta: {
        service: 'cargalog-api',
        environment: process.env.NODE_ENV || 'development',
      },
      transports: [
        // Console para desenvolvimento
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(
              ({ timestamp, level, message, context, ...meta }) => {
                const ctxValue = formatContext(context);
                const ctx = ctxValue ? `[${ctxValue}] ` : '';
                const metaStr =
                  Object.keys(meta).length > 0
                    ? `\n${JSON.stringify(meta, null, 2)}`
                    : '';
                const timestampStr = toLogString(timestamp);
                const levelStr = toLogString(level);
                const messageStr = toLogString(message);
                return `${timestampStr} ${levelStr}: ${ctx}${messageStr}${metaStr}`;
              },
            ),
          ),
        }),
        // Arquivo para todos os logs
        new winston.transports.File({
          filename: 'logs/combined.log',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        // Arquivo apenas para erros
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 5242880,
          maxFiles: 5,
        }),
      ],
    });

    // Em produção, adicionar transporte adicional (ex: CloudWatch, Datadog)
    if (process.env.NODE_ENV === 'production') {
      // Exemplo: integração futura com serviços de logging externos
    }
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  /**
   * Log estruturado com metadados customizados
   */
  logWithMeta(level: string, message: string, meta: Record<string, unknown>) {
    this.logger.log(level, message, meta);
  }

  /**
   * Log de request HTTP
   */
  logRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    userId?: string,
  ) {
    this.logger.info('HTTP Request', {
      method,
      url,
      statusCode,
      duration,
      userId,
      context: 'HttpRequest',
    });
  }

  /**
   * Log de erro com stack trace completo
   */
  logError(error: Error, context?: string) {
    this.logger.error(error.message, {
      context,
      stack: error.stack,
      name: error.name,
    });
  }
}
