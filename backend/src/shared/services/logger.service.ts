import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WinstonLoggerService } from './winston-logger.service';
import { AuditLog } from '../../domain/entities/audit-log.entity';

export interface AuditMetadata {
  usuarioId?: string;
  acao: string;
  entidade?: string;
  entidadeId?: string;
  dadosAntigos?: Record<string, unknown>;
  dadosNovos?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class LoggerService implements NestLoggerService {
  private winston: WinstonLoggerService;

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {
    this.winston = new WinstonLoggerService();
  }

  log(message: string, context?: string): void {
    this.winston.log(message, context);
  }

  error(message: string, trace?: string, context?: string): void {
    this.winston.error(message, trace, context);
  }

  warn(message: string, context?: string): void {
    this.winston.warn(message, context);
  }

  debug(message: string, context?: string): void {
    this.winston.debug(message, context);
  }

  verbose(message: string, context?: string): void {
    this.winston.verbose(message, context);
  }

  audit(metadata: AuditMetadata): void {
    this.winston.logWithMeta(
      'info',
      `[AUDIT] ${metadata.acao}`,
      metadata as unknown as Record<string, unknown>,
    );

    try {
      const log = this.auditRepository.create({
        usuarioId: metadata.usuarioId || null,
        acao: metadata.acao,
        entidade: metadata.entidade || null,
        entidadeId: metadata.entidadeId || null,
        dadosAnteriores: metadata.dadosAntigos || null,
        dadosNovos: metadata.dadosNovos || null,
        ip: metadata.ip || null,
        userAgent: metadata.userAgent || null,
      });

      this.auditRepository.save(log).catch((err) => {
        this.winston.error(
          'Falha ao salvar log no banco',
          err instanceof Error ? err.stack : undefined,
          'AuditLog',
        );
      });
    } catch (err) {
      this.winston.error(
        'Erro ao criar log de auditoria',
        err instanceof Error ? err.stack : undefined,
        'AuditLog',
      );
    }
  }
}
