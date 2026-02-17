/**
 * DTO de resposta para relatório de progresso
 */
export class RelatorioProgressoDto {
  exercicio: string;
  periodo: {
    inicio: Date;
    fim: Date;
  };
  cargaMaxima: number;
  cargaMedia: number;
  progresso: number; // Percentual
  totalTreinos: number;
  pontos: Array<{
    data: Date;
    carga: number;
    repeticoes: number;
    series?: number;
  }>;
}
