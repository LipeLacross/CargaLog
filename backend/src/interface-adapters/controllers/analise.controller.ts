import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { GerarRelatorioProgressoUseCase } from '../../application/use-cases/analise/gerar-relatorio-progresso.use-case';
import { ObterEstatisticasUseCase } from '../../application/use-cases/analise/obter-estatisticas.use-case';
import { JwtAuthGuard } from '../../frameworks/auth/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

/**
 * Controller de análises
 * Endpoints: estatísticas, progresso
 */
@Controller('analises')
@UseGuards(JwtAuthGuard)
export class AnaliseController {
  constructor(
    private readonly gerarRelatorioProgressoUseCase: GerarRelatorioProgressoUseCase,
    private readonly obterEstatisticasUseCase: ObterEstatisticasUseCase,
  ) {}

  /**
   * GET /analises/estatisticas
   * Retorna estatísticas gerais do usuário
   */
  @Get('estatisticas')
  async obterEstatisticas(@CurrentUser() usuario) {
    return this.obterEstatisticasUseCase.execute(usuario.id);
  }

  /**
   * GET /analises/progresso/:exercicio
   * Retorna relatório de progresso de um exercício
   */
  @Get('progresso/:exercicio')
  async gerarRelatorioProgresso(
    @Param('exercicio') exercicio: string,
    @CurrentUser() usuario,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    // Define período padrão (últimos 30 dias se não especificado)
    const fim = dataFim ? new Date(dataFim) : new Date();
    const inicio = dataInicio
      ? new Date(dataInicio)
      : new Date(fim.getTime() - 30 * 24 * 60 * 60 * 1000);

    return this.gerarRelatorioProgressoUseCase.execute(
      usuario.id,
      exercicio,
      inicio,
      fim,
    );
  }
}
