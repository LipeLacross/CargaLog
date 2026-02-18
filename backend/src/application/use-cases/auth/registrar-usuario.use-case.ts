import { Injectable, ConflictException, Inject } from '@nestjs/common';
import type { IUsuarioRepository } from '../../../domain/repositories/usuario.repository.interface';
import { Usuario } from '../../../domain/entities/usuario.entity';
import { RegistrarUsuarioDto } from '../../dto/auth/registrar-usuario.dto';
import { Email } from '../../../domain/value-objects/email.vo';

/**
 * Caso de uso: Registrar novo usuário
 * Responsabilidade: Criar usuário com validações e criptografia de senha
 */
@Injectable()
export class RegistrarUsuarioUseCase {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuarioRepository: IUsuarioRepository,
  ) {}

  async execute(dto: RegistrarUsuarioDto): Promise<Omit<Usuario, 'senha'>> {
    // Valida email usando Value Object
    const emailVO = new Email(dto.email);

    // Verifica se email já existe
    const emailExiste = await this.usuarioRepository.existeEmail(
      emailVO.getValue(),
    );
    if (emailExiste) {
      throw new ConflictException('Email já cadastrado');
    }

    // Criptografa senha
    const senhaHash = await Usuario.hashSenha(dto.senha);

    // Cria usuário
    const usuario = await this.usuarioRepository.criar({
      nome: dto.nome,
      email: emailVO.getValue(),
      senha: senhaHash,
    });

    // Remove senha da resposta
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }
}
