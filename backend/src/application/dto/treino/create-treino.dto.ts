import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsDateString,
} from 'class-validator';

/**
 * DTO para criação de treino
 */
export class CreateTreinoDto {
  @IsNotEmpty({ message: 'Nome do exercício é obrigatório' })
  @IsString({ message: 'Nome do exercício deve ser uma string' })
  exercicioNome: string;

  @IsNotEmpty({ message: 'Carga é obrigatória' })
  @IsNumber({}, { message: 'Carga deve ser um número' })
  @Min(0.1, { message: 'Carga deve ser maior que 0' })
  @Max(10000, { message: 'Carga deve ser menor ou igual a 10000' })
  carga: number;

  @IsNotEmpty({ message: 'Repetições são obrigatórias' })
  @IsInt({ message: 'Repetições devem ser um número inteiro' })
  @Min(1, { message: 'Repetições devem ser no mínimo 1' })
  @Max(1000, { message: 'Repetições devem ser no máximo 1000' })
  repeticoes: number;

  @IsOptional()
  @IsInt({ message: 'Séries devem ser um número inteiro' })
  @Min(1, { message: 'Séries devem ser no mínimo 1' })
  @Max(100, { message: 'Séries devem ser no máximo 100' })
  series?: number;

  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  observacoes?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data deve estar no formato válido' })
  data?: string; // ISO string, será convertido para Date
}
