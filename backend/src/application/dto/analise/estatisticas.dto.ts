/**
 * DTO de resposta para estatísticas gerais
 */
export class EstatisticasDto {
  totalTreinos: number;
  exercicios: string[];
  recordesPorExercicio: Record<
    string,
    {
      cargaMaxima: number;
      data: Date;
    }
  >;
  totalVolume?: number;
  exercicioMaisTreinado?: {
    nome: string;
    quantidade: number;
  };
}
