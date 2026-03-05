import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { IUsuarioRepository } from '../../../domain/repositories/usuario.repository.interface';
import { EmailService } from '../../../shared/services/email.service';

interface ResetPasswordRequest {
  email: string;
}

interface ConfirmResetPasswordRequest {
  token: string;
  novaSenha: string;
}

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Solicita reset de senha - envia email com link
   */
  async requestReset(request: ResetPasswordRequest): Promise<{ mensagem: string }> {
    const usuario = await this.usuarioRepository.buscarPorEmail(request.email);

    if (!usuario) {
      // Por segurança, não revelamos se o email existe ou não
      return { mensagem: 'Se o email existe, você receberá um link de reset.' };
    }

    // Gera token JWT válido por 1 hora
    const token = this.jwtService.sign(
      { userId: usuario.id, email: usuario.email, tipo: 'reset-password' },
      { expiresIn: '1h' },
    );

    // Constrói link de reset
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // Envia email
    await this.emailService.sendResetPasswordEmail(usuario.email, resetLink);

    return { mensagem: 'Se o email existe, você receberá um link de reset.' };
  }

  /**
   * Confirma reset de senha com novo token
   */
  async confirmReset(request: ConfirmResetPasswordRequest): Promise<{ mensagem: string }> {
    try {
      // Verifica e decodifica o token
      const payload = this.jwtService.verify(request.token);

      // Valida que é um token de reset de senha
      if (payload.tipo !== 'reset-password') {
        throw new BadRequestException('Token inválido');
      }

      // Busca o usuário
      const usuario = await this.usuarioRepository.buscarPorId(payload.userId);

      if (!usuario) {
        throw new BadRequestException('Usuário não encontrado');
      }

      // Valida nova senha
      if (request.novaSenha.length < 8) {
        throw new BadRequestException('Senha deve ter no mínimo 8 caracteres');
      }

      // Atualiza senha (será hasheada no banco)
      usuario.senha = request.novaSenha;
      await this.usuarioRepository.atualizar(usuario.id, usuario);

      // Envia email de confirmação
      await this.emailService.sendPasswordChangedEmail(usuario.email);

      return { mensagem: 'Senha redefinida com sucesso!' };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Link de reset expirou. Solicite um novo.');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new BadRequestException('Token inválido');
      }
      throw error;
    }
  }
}

