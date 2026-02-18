import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../../domain/entities/usuario.entity';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AuthController } from '../../interface-adapters/controllers/auth.controller';
import { RegistrarUsuarioUseCase } from '../../application/use-cases/auth/registrar-usuario.use-case';
import { AutenticarUsuarioUseCase } from '../../application/use-cases/auth/autenticar-usuario.use-case';
import { TypeOrmUsuarioRepository } from '../../interface-adapters/repositories/typeorm-usuario.repository';

/**
 * Módulo de Autenticação
 * Configuração de JWT e casos de uso de auth
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_key',
      signOptions: {
        expiresIn: parseInt(process.env.JWT_EXPIRATION || '604800', 10), // 7 days in seconds
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
