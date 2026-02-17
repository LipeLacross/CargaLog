import { Treino } from '../entities/treino.entity';

/**
 * Interface do repositório de Treino
 * Define o contrato para operações de persistência de treinos
 */
export interface ITreinoRepository {
  /**
   * Cria um novo treino
   */
  criar(treino: Partial<Treino>): Promise<Treino>;

  /**
   * Busca treino por ID
   */
  buscarPorId(id: string): Promise<Treino | null>;

  /**
   * Lista treinos de um usuário
   */
  listarPorUsuario(
    usuarioId: string,
    filtros?: {
      exercicio?: string;
      dataInicio?: Date;
      dataFim?: Date;
    },
  ): Promise<Treino[]>;

  /**
   * Busca treinos por exercício
   */
  buscarPorExercicio(usuarioId: string, exercicio: string): Promise<Treino[]>;

  /**
   * Atualiza dados do treino
   */
  atualizar(id: string, dados: Partial<Treino>): Promise<Treino>;

  /**
   * Deleta treino
   */
  deletar(id: string): Promise<void>;

  /**
   * Busca último treino de um exercício
   */
  buscarUltimoPorExercicio(
    usuarioId: string,
    exercicio: string,
  ): Promise<Treino | null>;

  /**
   * Conta total de treinos de um usuário
   */
  contarPorUsuario(usuarioId: string): Promise<number>;
}
