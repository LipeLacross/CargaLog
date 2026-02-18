import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ITreinoRepository } from '../../domain/repositories/treino.repository.interface';
import { Treino } from '../../domain/entities/treino.entity';

/**
 * Implementação do repositório de Treino usando TypeORM
 */
@Injectable()
export class TypeOrmTreinoRepository implements ITreinoRepository {
  constructor(
    @InjectRepository(Treino)
    private readonly repository: Repository<Treino>,
  ) {}

  async criar(treino: Partial<Treino>): Promise<Treino> {
    const novoTreino = this.repository.create(treino);
    return this.repository.save(novoTreino);
  }

  async buscarPorId(id: string): Promise<Treino | null> {
    return this.repository.findOne({ where: { id } });
  }

  async listarPorUsuario(
    usuarioId: string,
    filtros?: {
      exercicio?: string;
      dataInicio?: Date;
      dataFim?: Date;
    },
  ): Promise<Treino[]> {
    const query = this.repository
      .createQueryBuilder('treino')
      .where('treino.usuarioId = :usuarioId', { usuarioId })
      .orderBy('treino.data', 'DESC')
      .addOrderBy('treino.criadoEm', 'DESC');

    if (filtros?.exercicio) {
      query.andWhere('treino.exercicioNome = :exercicio', {
        exercicio: filtros.exercicio,
      });
    }

    if (filtros?.dataInicio && filtros?.dataFim) {
      query.andWhere('treino.data BETWEEN :dataInicio AND :dataFim', {
        dataInicio: filtros.dataInicio,
        dataFim: filtros.dataFim,
      });
    } else if (filtros?.dataInicio) {
      query.andWhere('treino.data >= :dataInicio', {
        dataInicio: filtros.dataInicio,
      });
    } else if (filtros?.dataFim) {
      query.andWhere('treino.data <= :dataFim', { dataFim: filtros.dataFim });
    }

    return query.getMany();
  }

  async buscarPorExercicio(
    usuarioId: string,
    exercicio: string,
  ): Promise<Treino[]> {
    return this.repository.find({
      where: {
        usuarioId,
        exercicioNome: exercicio,
      },
      order: {
        data: 'DESC',
        criadoEm: 'DESC',
      },
    });
  }

  async atualizar(id: string, dados: Partial<Treino>): Promise<Treino> {
    await this.repository.update(id, dados);
    const treinoAtualizado = await this.buscarPorId(id);
    if (!treinoAtualizado) {
      throw new Error('Treino não encontrado após atualização');
    }
    return treinoAtualizado;
  }

  async deletar(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async buscarUltimoPorExercicio(
    usuarioId: string,
    exercicio: string,
  ): Promise<Treino | null> {
    return this.repository.findOne({
      where: {
        usuarioId,
        exercicioNome: exercicio,
      },
      order: {
        data: 'DESC',
        criadoEm: 'DESC',
      },
    });
  }

  async contarPorUsuario(usuarioId: string): Promise<number> {
    return this.repository.count({ where: { usuarioId } });
  }
}
