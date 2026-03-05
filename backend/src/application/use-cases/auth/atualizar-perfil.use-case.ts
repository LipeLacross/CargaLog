import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IUsuarioRepository } from '../../../domain/repositories/usuario.repository.interface';
import { EmailService } from '../../../shared/services/email.service';
import { Usuario } from '../../../domain/entities/usuario.entity';

interface AtualizarPerfilRequest {
  nome?: string;
  senhaAtual?: string;
  novaSenha?: string;
}

@Injectable()
export class AtualizarPerfilUseCase {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(
    usuarioId: string,
    request: AtualizarPerfilRequest,
  ): Promise<Omit<Usuario, 'senha'>> {
    // Busca usuário
    const usuario = await this.usuarioRepository.buscarPorId(usuarioId);

    if (!usuario) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Se mudança de senha, valida senha atual
    if (request.novaSenha) {
      if (!request.senhaAtual) {
        throw new BadRequestException('Senha atual é obrigatória para mudar senha');
      }

      const senhaValida = await Usuario.validarSenha(
        request.senhaAtual,
        usuario.senha,
      );

      if (!senhaValida) {
        throw new BadRequestException('Senha atual incorreta');
      }

      if (request.novaSenha.length < 8) {
        throw new BadRequestException('Nova senha deve ter no mínimo 8 caracteres');
      }

      usuario.senha = request.novaSenha;
    }

    // Atualiza nome se fornecido
    if (request.nome && request.nome.trim()) {
      usuario.nome = request.nome.trim();
    }

    // Salva alterações
    await this.usuarioRepository.atualizar(usuarioId, usuario);

    // Envia email de confirmação
    if (request.novaSenha) {
      await this.emailService.sendPasswordChangedEmail(usuario.email);
    } else if (request.nome) {
      await this.emailService.sendProfileUpdatedEmail(usuario.email, usuario.nome);
    }

    // Retorna usuário sem senha
    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }
}

