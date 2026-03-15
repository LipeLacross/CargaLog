import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import type { ITreinoRepository } from '../../../domain/repositories/treino.repository.interface';
import { Treino } from '../../../domain/entities/treino.entity';
import { UpdateTreinoDto } from '../../dto/treino/update-treino.dto';
import { Carga } from '../../../domain/value-objects/carga.vo';
import { Repeticoes } from '../../../domain/value-objects/repeticoes.vo';
import { LoggerService } from '../../../shared/services/logger.service';

/**
 * Caso de uso: Atualizar treino
 * Responsabilidade: Atualizar dados do treino com validações
 */
@Injectable()
export class AtualizarTreinoUseCase {
  constructor(
    @Inject('ITreinoRepository')
    private readonly treinoRepository: ITreinoRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(
    treinoId: string,
    usuarioId: string,
    dto: UpdateTreinoDto,
  ): Promise<Treino> {
    // Busca treino
    const treino = await this.treinoRepository.buscarPorId(treinoId);

    if (!treino) {
      throw new NotFoundException('Treino não encontrado');
    }

    // Verifica propriedade (treino pertence ao usuário)
    if (treino.usuarioId !== usuarioId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar este treino',
      );
    }

    // Valida carga se fornecida
    if (dto.carga !== undefined) {
      try {
        new Carga(dto.carga);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Carga inválida';
        throw new BadRequestException(message);
      }
    }

    // Valida repetições se fornecidas
    if (dto.repeticoes !== undefined) {
      try {
        new Repeticoes(dto.repeticoes);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Repetições inválidas';
        throw new BadRequestException(message);
      }
    }

    // Valida séries se fornecidas
    if (dto.series !== undefined && !Treino.validarSeries(dto.series)) {
      throw new BadRequestException('Séries devem estar entre 1 e 100');
    }

    // Prepara dados para atualização
    const dadosAtualizacao: Partial<Treino> = {};

    if (dto.exercicioNome)
      dadosAtualizacao.exercicioNome = dto.exercicioNome.trim();
    if (dto.carga !== undefined) dadosAtualizacao.carga = dto.carga;
    if (dto.repeticoes !== undefined)
      dadosAtualizacao.repeticoes = dto.repeticoes;
    if (dto.series !== undefined) dadosAtualizacao.series = dto.series;
    if (dto.observacoes !== undefined)
      dadosAtualizacao.observacoes = dto.observacoes?.trim();
    if (dto.data) dadosAtualizacao.data = new Date(dto.data);

    // Atualiza treino
    const treinoAtualizado = await this.treinoRepository.atualizar(
      treinoId,
      dadosAtualizacao,
    );

    this.logger.audit({
      usuarioId,
      acao: 'ATUALIZAR_TREINO',
      entidade: 'Treino',
      entidadeId: treinoId,
      dadosAntigos: {
        exercicio: treino.exercicioNome,
        carga: treino.carga,
        repeticoes: treino.repeticoes,
        series: treino.series,
      },
      dadosNovos: dadosAtualizacao,
    });

    return treinoAtualizado;
  }
}
