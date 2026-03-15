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
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para criação de treino
 */
export class CreateTreinoDto {
  @ApiProperty({ example: 'Supino Reto', description: 'Nome do exercício' })
  @IsNotEmpty({ message: 'Nome do exercício é obrigatório' })
  @IsString({ message: 'Nome do exercício deve ser uma string' })
  exercicioNome: string;

  @ApiProperty({ example: 80, description: 'Carga em kg' })
  @IsNotEmpty({ message: 'Carga é obrigatória' })
  @IsNumber({}, { message: 'Carga deve ser um número' })
  @Min(0.1, { message: 'Carga deve ser maior que 0' })
  @Max(10000, { message: 'Carga deve ser menor ou igual a 10000' })
  carga: number;

  @ApiProperty({ example: 10, description: 'Número de repetições' })
  @IsNotEmpty({ message: 'Repetições são obrigatórias' })
  @IsInt({ message: 'Repetições devem ser um número inteiro' })
  @Min(1, { message: 'Repetições devem ser no mínimo 1' })
  @Max(1000, { message: 'Repetições devem ser no máximo 1000' })
  repeticoes: number;

  @ApiProperty({ example: 3, description: 'Número de séries', required: false })
  @IsOptional()
  @IsInt({ message: 'Séries devem ser um número inteiro' })
  @Min(1, { message: 'Séries devem ser no mínimo 1' })
  @Max(100, { message: 'Séries devem ser no máximo 100' })
  series?: number;

  @ApiProperty({
    example: 'Fazer alongamento antes',
    description: 'Observações',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  observacoes?: string;

  @ApiProperty({
    example: '2024-01-15T10:00:00Z',
    description: 'Data do treino (ISO string)',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data deve estar no formato válido' })
  data?: string; // ISO string, será convertido para Date
}
