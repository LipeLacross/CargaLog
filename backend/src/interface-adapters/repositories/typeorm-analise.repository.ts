import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAnaliseRepository } from '../../domain/repositories/analise.repository.interface';
import { Treino } from '../../domain/entities/treino.entity';
import { Analise } from '../../domain/entities/analise.entity';

// Tipos auxiliares para resultados de queries raw do TypeORM
interface ExercicioRow {
  exercicio: string;
}

interface RecordeRow {
  exercicio: string;
  cargaMaxima: string;
}

interface EvolucaoRow {
  data: string;
  cargaMaxima: string;
}

interface ComparacaoRow {
  exercicio: string;
  totalTreinos: string;
  cargaMaxima: string;
  cargaMedia: string;
}

/**
 * Implementação do repositório de Analise usando TypeORM
 */
@Injectable()
export class TypeOrmAnaliseRepository implements IAnaliseRepository {
  constructor(
    @InjectRepository(Treino)
    private readonly treinoRepository: Repository<Treino>,
  ) {}

  async obterEstatisticas(usuarioId: string): Promise<{
    totalTreinos: number;
    exercicios: string[];
    recordesPorExercicio: Record<string, number>;
    totalVolume: number;
    exercicioMaisTreinado: { nome: string; quantidade: number } | null;
  }> {
    // Total de treinos
    const totalTreinos = await this.treinoRepository.count({
      where: { usuarioId },
    });

    // Exercícios únicos
    const exerciciosQuery = await this.treinoRepository
      .createQueryBuilder('treino')
      .select('DISTINCT treino.exercicioNome', 'exercicio')
      .where('treino.usuarioId = :usuarioId', { usuarioId })
      .getRawMany<ExercicioRow>();

    const exercicios = exerciciosQuery.map((row) => row.exercicio);

    // Recorde de carga por exercício
    const recordesQuery = await this.treinoRepository
      .createQueryBuilder('treino')
      .select('treino.exercicioNome', 'exercicio')
      .addSelect('MAX(treino.carga)', 'cargaMaxima')
      .where('treino.usuarioId = :usuarioId', { usuarioId })
      .groupBy('treino.exercicioNome')
      .getRawMany<RecordeRow>();

    const recordesPorExercicio: Record<string, number> = {};
    recordesQuery.forEach((row) => {
      recordesPorExercicio[row.exercicio] = parseFloat(row.cargaMaxima);
    });

    // Volume total movimentado (carga × repetições × séries)
    const volumeQuery = await this.treinoRepository
      .createQueryBuilder('treino')
      .select('SUM(treino.carga * treino.repeticoes * treino.series)', 'volume')
      .where('treino.usuarioId = :usuarioId', { usuarioId })
      .getRawOne<{ volume: string }>();

    const totalVolume = volumeQuery?.volume
      ? parseFloat(volumeQuery.volume)
      : 0;

    // Exercício mais treinado
    const exercicioMaisTreinadoQuery = await this.treinoRepository
      .createQueryBuilder('treino')
      .select('treino.exercicioNome', 'nome')
      .addSelect('COUNT(*)', 'quantidade')
      .where('treino.usuarioId = :usuarioId', { usuarioId })
      .groupBy('treino.exercicioNome')
      .orderBy('COUNT(*)', 'DESC')
      .limit(1)
      .getRawOne<{ nome: string; quantidade: string }>();

    const exercicioMaisTreinado = exercicioMaisTreinadoQuery
      ? {
          nome: exercicioMaisTreinadoQuery.nome,
          quantidade: parseInt(exercicioMaisTreinadoQuery.quantidade, 10),
        }
      : null;

    return {
      totalTreinos,
      exercicios,
      recordesPorExercicio,
      totalVolume,
      exercicioMaisTreinado,
    };
  }

  async obterProgresso(
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
  }> {
    // Busca treinos no período
    const treinos = await this.treinoRepository
      .createQueryBuilder('treino')
      .where('treino.usuarioId = :usuarioId', { usuarioId })
      .andWhere('treino.exercicioNome = :exercicio', { exercicio })
      .andWhere('treino.data BETWEEN :inicio AND :fim', {
        inicio: periodoInicio,
        fim: periodoFim,
      })
      .orderBy('treino.data', 'ASC')
      .getMany();

    if (treinos.length === 0) {
      return {
        exercicio,
        periodo: { inicio: periodoInicio, fim: periodoFim },
        cargaMaxima: 0,
        cargaMedia: 0,
        progresso: 0,
        pontos: [],
      };
    }

    // Calcula métricas
    const cargas = treinos.map((t) => t.carga);
    const cargaMaxima = Math.max(...cargas);
    const cargaMedia = Analise.calcularMedia(cargas);

    // Calcula progresso (primeira carga vs última carga)
    const primeiraCarga = treinos[0].carga;
    const ultimaCarga = treinos[treinos.length - 1].carga;
    const progresso = Analise.calcularProgresso(primeiraCarga, ultimaCarga);

    // Monta pontos do gráfico
    const pontos = treinos.map((t) => ({
      data: t.data,
      carga: t.carga,
      repeticoes: t.repeticoes,
    }));

    return {
      exercicio,
      periodo: { inicio: periodoInicio, fim: periodoFim },
      cargaMaxima,
      cargaMedia,
      progresso,
      pontos,
    };
  }

  async obterEvolucaoCarga(
    usuarioId: string,
    exercicio: string,
  ): Promise<Array<{ data: Date; cargaMaxima: number }>> {
    const evolucao = await this.treinoRepository
      .createQueryBuilder('treino')
      .select('DATE(treino.data)', 'data')
      .addSelect('MAX(treino.carga)', 'cargaMaxima')
      .where('treino.usuarioId = :usuarioId', { usuarioId })
      .andWhere('treino.exercicioNome = :exercicio', { exercicio })
      .groupBy('DATE(treino.data)')
      .orderBy('DATE(treino.data)', 'ASC')
      .getRawMany<EvolucaoRow>();

    return evolucao.map((row) => ({
      data: new Date(row.data),
      cargaMaxima: parseFloat(row.cargaMaxima),
    }));
  }

  async compararExercicios(
    usuarioId: string,
    exercicios: string[],
  ): Promise<
    Array<{
      exercicio: string;
      totalTreinos: number;
      cargaMaxima: number;
      cargaMedia: number;
    }>
  > {
    const comparacao = await this.treinoRepository
      .createQueryBuilder('treino')
      .select('treino.exercicioNome', 'exercicio')
      .addSelect('COUNT(*)', 'totalTreinos')
      .addSelect('MAX(treino.carga)', 'cargaMaxima')
      .addSelect('AVG(treino.carga)', 'cargaMedia')
      .where('treino.usuarioId = :usuarioId', { usuarioId })
      .andWhere('treino.exercicioNome IN (:...exercicios)', { exercicios })
      .groupBy('treino.exercicioNome')
      .getRawMany<ComparacaoRow>();

    return comparacao.map((row) => ({
      exercicio: row.exercicio,
      totalTreinos: parseInt(row.totalTreinos, 10),
      cargaMaxima: parseFloat(row.cargaMaxima),
      cargaMedia: parseFloat(row.cargaMedia),
    }));
  }
}
