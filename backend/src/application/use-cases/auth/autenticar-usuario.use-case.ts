import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { IUsuarioRepository } from '../../../domain/repositories/usuario.repository.interface';
import { Usuario } from '../../../domain/entities/usuario.entity';
import { LoginDto } from '../../dto/auth/login.dto';
import { TokenPayloadDto } from '../../dto/auth/token-payload.dto';
import { LoggerService } from '../../../shared/services/logger.service';

/**
 * Caso de uso: Autenticar usuário
 * Responsabilidade: Validar credenciais e gerar token JWT
 */
@Injectable()
export class AutenticarUsuarioUseCase {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {}

  async execute(dto: LoginDto): Promise<{
    token: string;
    usuario: Omit<Usuario, 'senha'>;
  }> {
    // Busca usuário por email
    const usuario = await this.usuarioRepository.buscarPorEmail(dto.email);

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Valida senha
    const senhaValida = await Usuario.validarSenha(dto.senha, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gera token JWT
    const payload: TokenPayloadDto = {
      userId: usuario.id,
      email: usuario.email,
    };

    const token = this.jwtService.sign(payload);

    this.logger.audit({
      usuarioId: usuario.id,
      acao: 'LOGIN_SUCESSO',
      dadosNovos: { email: usuario.email },
    });

    // Remove senha da resposta
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha, ...usuarioSemSenha } = usuario;

    return {
      token,
      usuario: usuarioSemSenha,
    };
  }
}
