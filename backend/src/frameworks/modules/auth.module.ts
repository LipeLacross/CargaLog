import { Module, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../../domain/entities/usuario.entity';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AuthController } from '../../interface-adapters/controllers/auth.controller';
import { RegistrarUsuarioUseCase } from '../../application/use-cases/auth/registrar-usuario.use-case';
import { AutenticarUsuarioUseCase } from '../../application/use-cases/auth/autenticar-usuario.use-case';
import { TypeOrmUsuarioRepository } from '../../interface-adapters/repositories/typeorm-usuario.repository';

// Obter segredo JWT com validação
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET || 'default_secret_key';
  if (secret === 'default_secret_key') {
    Logger.warn(
      '⚠️ JWT_SECRET não definido no .env, usando segredo padrão. Isso é INSEGURO em produção!',
      'AuthModule',
    );
  }
  return secret;
};

const jwtSecret = getJwtSecret();
const jwtExpiration = process.env.JWT_EXPIRATION || '7d';
const jwtExpiresIn: number | `${number}${'s' | 'm' | 'h' | 'd'}` = /^\d+$/.test(
  jwtExpiration,
)
  ? Number(jwtExpiration)
  : (jwtExpiration as `${number}${'s' | 'm' | 'h' | 'd'}`);

/**
 * Módulo de Autenticação
 * Configuração de JWT e casos de uso de auth
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: jwtExpiresIn,
        algorithm: 'HS256',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    RegistrarUsuarioUseCase,
    AutenticarUsuarioUseCase,
    {
      provide: 'IUsuarioRepository',
      useClass: TypeOrmUsuarioRepository,
    },
  ],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
