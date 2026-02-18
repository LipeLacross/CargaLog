import { Injectable, Inject } from '@nestjs/common';
import type { IAnaliseRepository } from '../../../domain/repositories/analise.repository.interface';
import { RelatorioProgressoDto } from '../../dto/analise/relatorio-progresso.dto';

/**
 * Caso de uso: Gerar relatório de progresso
 * Responsabilidade: Calcular métricas e evolução de um exercício
 */
@Injectable()
export class GerarRelatorioProgressoUseCase {
  constructor(
    @Inject('IAnaliseRepository')
    private readonly analiseRepository: IAnaliseRepository,
  ) {}

  async execute(
    usuarioId: string,
    exercicio: string,
    periodoInicio: Date,
    periodoFim: Date,
  ): Promise<RelatorioProgressoDto> {
    // Obtém dados de progresso do repositório
    const progresso = await this.analiseRepository.obterProgresso(
      usuarioId,
      exercicio,
      periodoInicio,
      periodoFim,
    );

    return {
      exercicio: progresso.exercicio,
      periodo: progresso.periodo,
      cargaMaxima: progresso.cargaMaxima,
      cargaMedia: progresso.cargaMedia,
      progresso: progresso.progresso,
      totalTreinos: progresso.pontos.length,
      pontos: progresso.pontos,
    };
  }
}
