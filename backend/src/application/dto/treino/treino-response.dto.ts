/**
 * DTO de resposta para treino
 */
export class TreinoResponseDto {
  id: string;
  exercicioNome: string;
  carga: number;
  repeticoes: number;
  series: number;
  observacoes?: string;
  data: Date;
  criadoEm: Date;
  volume?: number; // carga x repeticoes x series
}
