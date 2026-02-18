import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUsuarioRepository } from '../../domain/repositories/usuario.repository.interface';
import { Usuario } from '../../domain/entities/usuario.entity';

/**
 * Implementação do repositório de Usuario usando TypeORM
 */
@Injectable()
export class TypeOrmUsuarioRepository implements IUsuarioRepository {
  constructor(
    @InjectRepository(Usuario)
    private readonly repository: Repository<Usuario>,
  ) {}

  async criar(usuario: Partial<Usuario>): Promise<Usuario> {
    const novoUsuario = this.repository.create(usuario);
    return this.repository.save(novoUsuario);
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    return this.repository.findOne({ where: { id } });
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.repository.findOne({ where: { email } });
  }

  async atualizar(id: string, dados: Partial<Usuario>): Promise<Usuario> {
    await this.repository.update(id, dados);
    const usuarioAtualizado = await this.buscarPorId(id);
    if (!usuarioAtualizado) {
      throw new Error('Usuário não encontrado após atualização');
    }
    return usuarioAtualizado;
  }

  async deletar(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async existeEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }
}
