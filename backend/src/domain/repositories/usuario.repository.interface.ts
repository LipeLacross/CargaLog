import { Usuario } from '../entities/usuario.entity';

/**
 * Interface do repositório de Usuario
 * Define o contrato para operações de persistência de usuários
 */
export interface IUsuarioRepository {
  /**
   * Cria um novo usuário
   */
  criar(usuario: Partial<Usuario>): Promise<Usuario>;

  /**
   * Busca usuário por ID
   */
  buscarPorId(id: string): Promise<Usuario | null>;

  /**
   * Busca usuário por email
   */
  buscarPorEmail(email: string): Promise<Usuario | null>;

  /**
   * Atualiza dados do usuário
   */
  atualizar(id: string, dados: Partial<Usuario>): Promise<Usuario>;

  /**
   * Deleta usuário
   */
  deletar(id: string): Promise<void>;

  /**
   * Verifica se email já existe
   */
  existeEmail(email: string): Promise<boolean>;
}
