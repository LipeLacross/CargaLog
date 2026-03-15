import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import type { ITreinoRepository } from '../../../domain/repositories/treino.repository.interface';
import { LoggerService } from '../../../shared/services/logger.service';

/**
 * Caso de uso: Deletar treino
 * Responsabilidade: Remover treino com verificação de propriedade
 */
@Injectable()
export class DeletarTreinoUseCase {
  constructor(
    @Inject('ITreinoRepository')
    private readonly treinoRepository: ITreinoRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(treinoId: string, usuarioId: string): Promise<void> {
    // Busca treino
    const treino = await this.treinoRepository.buscarPorId(treinoId);

    if (!treino) {
      throw new NotFoundException('Treino não encontrado');
    }

    // Verifica propriedade (treino pertence ao usuário)
    if (treino.usuarioId !== usuarioId) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar este treino',
      );
    }

    this.logger.audit({
      usuarioId,
      acao: 'DELETAR_TREINO',
      entidade: 'Treino',
      entidadeId: treinoId,
      dadosAntigos: { treinoId, exercicio: treino.exercicioNome },
    });

    await this.treinoRepository.deletar(treinoId);
  }
}
