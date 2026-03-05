import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { StringValue } from 'ms';
import { AutenticarUsuarioUseCase } from '../../application/use-cases/auth/autenticar-usuario.use-case';
import { RegistrarUsuarioUseCase } from '../../application/use-cases/auth/registrar-usuario.use-case';
import { ResetPasswordUseCase } from '../../application/use-cases/auth/reset-password.use-case';
import { AtualizarPerfilUseCase } from '../../application/use-cases/auth/atualizar-perfil.use-case';
import { Usuario } from '../../domain/entities/usuario.entity';
import { AuthController } from '../../interface-adapters/controllers/auth.controller';
import { TypeOrmUsuarioRepository } from '../../interface-adapters/repositories/typeorm-usuario.repository';
import { JwtStrategy } from '../auth/jwt.strategy';
import { EmailService } from '../../shared/services/email.service';

const authModuleLogger = new Logger('AuthModule');

/**
 * Módulo de Autenticação
 * Configuração de JWT e casos de uso de auth
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret =
          configService.get<string>('JWT_SECRET') || 'default_secret_key';
        const jwtExpiration =
          configService.get<string>('JWT_EXPIRATION') || '7d';

        if (jwtSecret === 'default_secret_key') {
          authModuleLogger.warn(
            'JWT_SECRET nao definido no .env, usando segredo padrao. Isso e inseguro em producao.',
          );
        }

        const jwtExpiresIn: number | StringValue = /^\d+$/.test(jwtExpiration)
          ? Number(jwtExpiration)
          : (jwtExpiration as StringValue);

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: jwtExpiresIn,
            algorithm: 'HS256' as const,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    EmailService,
    RegistrarUsuarioUseCase,
    AutenticarUsuarioUseCase,
    ResetPasswordUseCase,
    AtualizarPerfilUseCase,
    {
      provide: 'IUsuarioRepository',
      useClass: TypeOrmUsuarioRepository,
    },
  ],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
