import { Injectable, Inject } from '@nestjs/common';
import type { ITreinoRepository } from '../../../domain/repositories/treino.repository.interface';
import { Treino } from '../../../domain/entities/treino.entity';

/**
 * Caso de uso: Listar treinos do usuário
 * Responsabilidade: Buscar treinos com filtros opcionais
 */
@Injectable()
export class ListarTreinosUseCase {
  constructor(
    @Inject('ITreinoRepository')
    private readonly treinoRepository: ITreinoRepository,
  ) {}

  async execute(
    usuarioId: string,
    filtros?: {
      exercicio?: string;
      dataInicio?: Date;
      dataFim?: Date;
    },
  ): Promise<Treino[]> {
    return this.treinoRepository.listarPorUsuario(usuarioId, filtros);
  }
}
