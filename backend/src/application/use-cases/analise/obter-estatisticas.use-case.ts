import { Injectable, Inject } from '@nestjs/common';
import type { IAnaliseRepository } from '../../../domain/repositories/analise.repository.interface';
import { EstatisticasDto } from '../../dto/analise/estatisticas.dto';

/**
 * Caso de uso: Obter estatísticas gerais
 * Responsabilidade: Calcular estatísticas gerais do usuário
 */
@Injectable()
export class ObterEstatisticasUseCase {
  constructor(
    @Inject('IAnaliseRepository')
    private readonly analiseRepository: IAnaliseRepository,
  ) {}

  async execute(usuarioId: string): Promise<EstatisticasDto> {
    // Obtém estatísticas do repositório
    const stats = await this.analiseRepository.obterEstatisticas(usuarioId);

    // Formata recordes por exercício
    const recordesPorExercicio: Record<
      string,
      { cargaMaxima: number; data: Date }
    > = {};

    for (const [exercicio, carga] of Object.entries(
      stats.recordesPorExercicio,
    )) {
      recordesPorExercicio[exercicio] = {
        cargaMaxima: carga,
        data: new Date(), // TODO: Buscar data real do recorde
      };
    }

    return {
      totalTreinos: stats.totalTreinos,
      exercicios: stats.exercicios,
      recordesPorExercicio,
    };
  }
}
