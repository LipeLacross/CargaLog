import { Test, TestingModule } from '@nestjs/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { AtualizarTreinoUseCase } from './atualizar-treino.use-case';
import { ITreinoRepository } from '../../../domain/repositories/treino.repository.interface';
import { UpdateTreinoDto } from '../../dto/treino/update-treino.dto';
import { Treino } from '../../../domain/entities/treino.entity';
import { LoggerService } from '../../../shared/services/logger.service';

describe('AtualizarTreinoUseCase', () => {
  let useCase: AtualizarTreinoUseCase;
  let repository: ReturnType<typeof vi.fn>;

  const mockRepositorio = {
    criar: vi.fn(),
    buscarPorId: vi.fn(),
    listarPorUsuario: vi.fn(),
    atualizar: vi.fn(),
    deletar: vi.fn(),
    obterEstatisticas: vi.fn(),
  };

  const mockLogger = {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    verbose: vi.fn(),
    audit: vi.fn().mockResolvedValue(undefined),
  };

  const treinoExistente: Treino = {
    id: 'treino-123',
    usuarioId: 'usuario-123',
    exercicioNome: 'Supino Reto',
    carga: 80,
    repeticoes: 10,
    series: 3,
    observacoes: 'Treino antigo',
    data: new Date('2026-01-01'),
    criadoEm: new Date(),
    usuario: undefined,
    calcularVolume: function (): number {
      return this.carga * this.repeticoes * this.series;
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AtualizarTreinoUseCase,
        {
          provide: 'ITreinoRepository',
          useValue: mockRepositorio,
        },
        {
          provide: LoggerService,
          useFactory: () => mockLogger,
        },
      ],
    }).compile();

    useCase = module.get<AtualizarTreinoUseCase>(AtualizarTreinoUseCase);
    repository = module.get('ITreinoRepository');
  });

  describe('Caminho Feliz', () => {
    it('deve atualizar treino com sucesso', async () => {
      // Arrange
      const treinoId = 'treino-123';
      const usuarioId = 'usuario-123';
      const dto: UpdateTreinoDto = {
        carga: 90,
        repeticoes: 12,
      } as any;

      repository.buscarPorId.mockResolvedValue(treinoExistente);
      const treinoAtualizado = { ...treinoExistente, ...dto };
      repository.atualizar.mockResolvedValue(treinoAtualizado);

      // Act
      const resultado = await useCase.execute(treinoId, usuarioId, dto);

      // Assert
      expect(resultado).toBeDefined();
      expect(repository.atualizar).toHaveBeenCalled();
      expect(repository.buscarPorId).toHaveBeenCalledWith(treinoId);
    });

    it('deve atualizar apenas os campos fornecidos', async () => {
      // Arrange
      const treinoId = 'treino-123';
      const usuarioId = 'usuario-123';
      const dto: UpdateTreinoDto = {
        carga: 100,
      } as any;

      repository.buscarPorId.mockResolvedValue(treinoExistente);
      repository.atualizar.mockResolvedValue({ ...treinoExistente, ...dto });

      // Act
      await useCase.execute(treinoId, usuarioId, dto);

      // Assert
      expect(repository.atualizar).toHaveBeenCalledWith(
        treinoId,
        expect.objectContaining({ carga: 100 }),
      );
    });
  });

  describe('Validações de Propriedade', () => {
    it('deve lançar NotFoundException se treino não existe', async () => {
      // Arrange
      const treinoId = 'treino-inexistente';
      const usuarioId = 'usuario-123';
      const dto: UpdateTreinoDto = {} as any;

      repository.buscarPorId.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(treinoId, usuarioId, dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.atualizar).not.toHaveBeenCalled();
    });

    it('deve lançar ForbiddenException se usuário não é dono', async () => {
      // Arrange
      const treinoId = 'treino-123';
      const usuarioIdDiferente = 'usuario-456';
      const dto: UpdateTreinoDto = {} as any;

      repository.buscarPorId.mockResolvedValue(treinoExistente);

      // Act & Assert
      await expect(
        useCase.execute(treinoId, usuarioIdDiferente, dto),
      ).rejects.toThrow(ForbiddenException);
      expect(repository.atualizar).not.toHaveBeenCalled();
    });
  });

  describe('Validações de Dados', () => {
    it('deve validar carga se fornecida', async () => {
      // Arrange
      const treinoId = 'treino-123';
      const usuarioId = 'usuario-123';
      const dto: UpdateTreinoDto = {
        carga: -50,
      } as any;

      repository.buscarPorId.mockResolvedValue(treinoExistente);

      // Act & Assert
      await expect(useCase.execute(treinoId, usuarioId, dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.atualizar).not.toHaveBeenCalled();
    });

    it('deve validar repetições se fornecidas', async () => {
      // Arrange
      const treinoId = 'treino-123';
      const usuarioId = 'usuario-123';
      const dto: UpdateTreinoDto = {
        repeticoes: -5,
      } as any;

      repository.buscarPorId.mockResolvedValue(treinoExistente);

      // Act & Assert
      await expect(useCase.execute(treinoId, usuarioId, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve validar séries se fornecidas', async () => {
      // Arrange
      const treinoId = 'treino-123';
      const usuarioId = 'usuario-123';
      const dto: UpdateTreinoDto = {
        series: 0,
      } as any;

      repository.buscarPorId.mockResolvedValue(treinoExistente);

      // Act & Assert
      await expect(useCase.execute(treinoId, usuarioId, dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('Normalização de Dados', () => {
    it('deve trimmar exercícioNome', async () => {
      // Arrange
      const treinoId = 'treino-123';
      const usuarioId = 'usuario-123';
      const dto: UpdateTreinoDto = {
        exercicioNome: '  Supino Inclinado  ',
      } as any;

      repository.buscarPorId.mockResolvedValue(treinoExistente);
      repository.atualizar.mockResolvedValue({
        ...treinoExistente,
        exercicioNome: 'Supino Inclinado',
      });

      // Act
      await useCase.execute(treinoId, usuarioId, dto);

      // Assert
      expect(repository.atualizar).toHaveBeenCalledWith(
        treinoId,
        expect.objectContaining({ exercicioNome: 'Supino Inclinado' }),
      );
    });

    it('deve trimmar observações', async () => {
      // Arrange
      const treinoId = 'treino-123';
      const usuarioId = 'usuario-123';
      const dto: UpdateTreinoDto = {
        observacoes: '  Novo comentário  ',
      } as any;

      repository.buscarPorId.mockResolvedValue(treinoExistente);
      repository.atualizar.mockResolvedValue({
        ...treinoExistente,
        observacoes: 'Novo comentário',
      });

      // Act
      await useCase.execute(treinoId, usuarioId, dto);

      // Assert
      expect(repository.atualizar).toHaveBeenCalledWith(
        treinoId,
        expect.objectContaining({ observacoes: 'Novo comentário' }),
      );
    });

    it('deve converter data string para Date object', async () => {
      // Arrange
      const treinoId = 'treino-123';
      const usuarioId = 'usuario-123';
      const dataString = '2026-02-01';
      const dto: UpdateTreinoDto = {
        data: dataString,
      } as any;

      repository.buscarPorId.mockResolvedValue(treinoExistente);
      repository.atualizar.mockResolvedValue({
        ...treinoExistente,
        data: new Date(dataString),
      });

      // Act
      await useCase.execute(treinoId, usuarioId, dto);

      // Assert
      expect(repository.atualizar).toHaveBeenCalledWith(
        treinoId,
        expect.objectContaining({
          data: expect.any(Date),
        }),
      );
    });
  });
});
