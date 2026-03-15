import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { ITreinoRepository } from '../../../domain/repositories/treino.repository.interface';
import { Treino } from '../../../domain/entities/treino.entity';
import { CreateTreinoDto } from '../../dto/treino/create-treino.dto';
import { Carga } from '../../../domain/value-objects/carga.vo';
import { Repeticoes } from '../../../domain/value-objects/repeticoes.vo';
import { LoggerService } from '../../../shared/services/logger.service';

/**
 * Caso de uso: Registrar novo treino
 * Responsabilidade: Criar treino com validações de domínio
 */
@Injectable()
export class RegistrarTreinoUseCase {
  constructor(
    @Inject('ITreinoRepository')
    private readonly treinoRepository: ITreinoRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(usuarioId: string, dto: CreateTreinoDto): Promise<Treino> {
    // Valida carga usando Value Object
    try {
      new Carga(dto.carga);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Carga inválida';
      throw new BadRequestException(message);
    }

    // Valida repetições usando Value Object
    try {
      new Repeticoes(dto.repeticoes);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Repetições inválidas';
      throw new BadRequestException(message);
    }

    // Valida séries se fornecidas (considera 0 como inválido)
    if (dto.series !== undefined && !Treino.validarSeries(dto.series)) {
      throw new BadRequestException('Séries devem estar entre 1 e 100');
    }

    // Cria treino
    const treino = await this.treinoRepository.criar({
      usuarioId,
      exercicioNome: dto.exercicioNome.trim(),
      carga: dto.carga,
      repeticoes: dto.repeticoes,
      series: dto.series || 1,
      observacoes: dto.observacoes?.trim(),
      data: dto.data ? new Date(dto.data) : new Date(),
    });

    await this.logger.audit({
      usuarioId,
      acao: 'CRIAR_TREINO',
      entidade: 'Treino',
      entidadeId: treino.id,
      dadosNovos: { exercicio: treino.exercicioNome, carga: treino.carga },
    });

    return treino;
  }
}
