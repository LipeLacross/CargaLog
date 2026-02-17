/**
 * Interface do repositório de Analise
 * Define o contrato para operações de análise e estatísticas
 */
export interface IAnaliseRepository {
  /**
   * Obtém estatísticas gerais de um usuário
   */
  obterEstatisticas(usuarioId: string): Promise<{
    totalTreinos: number;
    exercicios: string[];
    recordesPorExercicio: Record<string, number>;
  }>;

  /**
   * Obtém progresso de um exercício em um período
   */
  obterProgresso(
    usuarioId: string,
    exercicio: string,
    periodoInicio: Date,
    periodoFim: Date,
  ): Promise<{
    exercicio: string;
    periodo: { inicio: Date; fim: Date };
    cargaMaxima: number;
    cargaMedia: number;
    progresso: number;
    pontos: Array<{ data: Date; carga: number; repeticoes: number }>;
  }>;

  /**
   * Obtém evolução de carga ao longo do tempo
   */
  obterEvolucaoCarga(
    usuarioId: string,
    exercicio: string,
  ): Promise<Array<{ data: Date; cargaMaxima: number }>>;

  /**
   * Obtém comparação entre exercícios
   */
  compararExercicios(
    usuarioId: string,
    exercicios: string[],
  ): Promise<
    Array<{
      exercicio: string;
      totalTreinos: number;
      cargaMaxima: number;
      cargaMedia: number;
    }>
  >;
}
