import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

/**
 * Serviço de Configuração
 * Centraliza acesso a variáveis de ambiente com tipagem segura
 */
@Injectable()
export class ConfiguracaoService {
  constructor(private readonly configService: NestConfigService) {}

  // Aplicação
  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV') || 'development';
  }

  get port(): number {
    return parseInt(this.configService.get<string>('PORT') || '3000', 10);
  }

  get corsOrigin(): string {
    return this.configService.get<string>('CORS_ORIGIN') || '*';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  // Banco de Dados
  get databaseUrl(): string {
    const url = this.configService.get<string>('DATABASE_URL');
    if (!url) {
      throw new Error('DATABASE_URL não configurada no .env');
    }
    return url;
  }

  get directDatabaseUrl(): string {
    const url = this.configService.get<string>('DIRECT_URL');
    if (!url) {
      throw new Error(
        'DIRECT_URL não configurada no .env (necessária para migrations)',
      );
    }
    return url;
  }

  // JWT
  get jwtSecret(): string {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret || secret.length < 32) {
      throw new Error('JWT_SECRET deve ter no mínimo 32 caracteres');
    }
    return secret;
  }

  get jwtExpiration(): string {
    return this.configService.get<string>('JWT_EXPIRATION') || '7d';
  }

  // Bcrypt
  get bcryptSaltRounds(): number {
    return parseInt(
      this.configService.get<string>('BCRYPT_SALT_ROUNDS') || '10',
      10,
    );
  }

  // Logs
  get logLevel(): string {
    return this.configService.get<string>('LOG_LEVEL') || 'info';
  }
}
