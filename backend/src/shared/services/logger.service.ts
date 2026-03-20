import {
  Injectable,
  LoggerService as NestLoggerService,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Use NestJS Logger instead of external Winston implementation
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
  private logger = new Logger('LoggerService');

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {
    // using NestJS Logger instance
  }

  log(message: string, context?: string): void {
    this.logger.log(message, context);
  }

  error(message: string, trace?: string, _context?: string): void {
    // Nest Logger.error signature is (message, trace?)
    this.logger.error(message, trace);
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, context);
  }

  verbose(message: string, context?: string): void {
    // Nest Logger doesn't have verbose by default; use log to represent verbose
    this.logger.log(message, context);
  }

  audit(metadata: AuditMetadata): void {
    this.logger.log(`[AUDIT] ${metadata.acao} ${JSON.stringify(metadata)}`);

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
        this.logger.error(
          'Falha ao salvar log no banco',
          err instanceof Error ? err.stack : undefined,
        );
      });
    } catch (err) {
      this.logger.error(
        'Erro ao criar log de auditoria',
        err instanceof Error ? err.stack : undefined,
      );
    }
  }
}
