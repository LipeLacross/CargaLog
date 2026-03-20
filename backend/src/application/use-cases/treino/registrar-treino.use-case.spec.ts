import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { RegistrarTreinoUseCase } from './registrar-treino.use-case';
import { ITreinoRepository } from '../../../domain/repositories/treino.repository.interface';
import { CreateTreinoDto } from '../../dto/treino/create-treino.dto';
import { LoggerService } from '../../../shared/services/logger.service';

describe('RegistrarTreinoUseCase', () => {
  let useCase: RegistrarTreinoUseCase;
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

  beforeEach(() => {
    vi.clearAllMocks();
    repository = mockRepositorio;
    useCase = new RegistrarTreinoUseCase(
      mockRepositorio as unknown as ITreinoRepository,
      mockLogger as unknown as LoggerService,
    );
  });

  describe('Caminho Feliz', () => {
    it('deve registrar treino com sucesso', async () => {
      // Arrange
      const usuarioId = 'usuario-123';
      const dto: CreateTreinoDto = {
        exercicioNome: 'Supino Reto',
        carga: 80,
        repeticoes: 10,
        series: 3,
        observacoes: 'Treino intenso',
        data: new Date().toISOString(),
      };

      const treinoCriado = {
        id: 'treino-123',
        usuarioId,
        exercicioNome: dto.exercicioNome,
        carga: dto.carga,
        repeticoes: dto.repeticoes,
        series: dto.series,
        observacoes: dto.observacoes,
        data: new Date(dto.data),
        criadoEm: new Date(),
        usuario: undefined,
        calcularVolume: () => 80 * 10 * 3,
      } as any;

      repository.criar.mockResolvedValue(treinoCriado);

      // Act
      const resultado = await useCase.execute(usuarioId, dto);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado.id).toBe('treino-123');
      expect(resultado.exercicioNome).toBe(dto.exercicioNome);
      expect(resultado.carga).toBe(dto.carga);
      expect(resultado.repeticoes).toBe(dto.repeticoes);
      expect(repository.criar).toHaveBeenCalledWith(
        expect.objectContaining({
          usuarioId,
          exercicioNome: dto.exercicioNome,
        }),
      );
    });

    it('deve usar data atual se não fornecida', async () => {
      // Arrange
      const usuarioId = 'usuario-123';
      const dto: CreateTreinoDto = {
        exercicioNome: 'Rosca Direta',
        carga: 20,
        repeticoes: 12,
        series: 4,
      } as any;

      repository.criar.mockResolvedValue({
        id: 'treino-123',
        usuarioId,
        exercicioNome: dto.exercicioNome,
        carga: dto.carga,
        repeticoes: dto.repeticoes,
        series: dto.series,
        observacoes: null,
        data: expect.any(Date),
        criadoEm: new Date(),
        usuario: undefined,
      } as any);

      // Act
      await useCase.execute(usuarioId, dto);

      // Assert
      expect(repository.criar).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.any(Date),
        }),
      );
    });
  });

  describe('Validações de Carga', () => {
    it('deve lançar exceção se carga é negativa', async () => {
      // Arrange
      const usuarioId = 'usuario-123';
      const dto: CreateTreinoDto = {
        exercicioNome: 'Supino Reto',
        carga: -10,
        repeticoes: 10,
        series: 3,
      } as any;

      // Act & Assert
      await expect(useCase.execute(usuarioId, dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.criar).not.toHaveBeenCalled();
    });

    it('deve lançar exceção se carga é zero', async () => {
      // Arrange
      const usuarioId = 'usuario-123';
      const dto: CreateTreinoDto = {
        exercicioNome: 'Supino Reto',
        carga: 0,
        repeticoes: 10,
        series: 3,
      } as any;

      // Act & Assert
      await expect(useCase.execute(usuarioId, dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('Validações de Repetições', () => {
    it('deve lançar exceção se repetições é zero', async () => {
      // Arrange
      const usuarioId = 'usuario-123';
      const dto: CreateTreinoDto = {
        exercicioNome: 'Supino Reto',
        carga: 80,
        repeticoes: 0,
        series: 3,
      } as any;

      // Act & Assert
      await expect(useCase.execute(usuarioId, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar exceção se repetições negativo', async () => {
      // Arrange
      const usuarioId = 'usuario-123';
      const dto: CreateTreinoDto = {
        exercicioNome: 'Supino Reto',
        carga: 80,
        repeticoes: -5,
        series: 3,
      } as any;

      // Act & Assert
      await expect(useCase.execute(usuarioId, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve aceitar repetições máximas válidas', async () => {
      // Arrange
      const usuarioId = 'usuario-123';
      const dto: CreateTreinoDto = {
        exercicioNome: 'Supino Reto',
        carga: 10,
        repeticoes: 1000,
        series: 1,
      } as any;

      repository.criar.mockResolvedValue({
        id: 'treino-123',
        usuarioId,
        exercicioNome: dto.exercicioNome,
        carga: dto.carga,
        repeticoes: dto.repeticoes,
        series: dto.series,
        observacoes: null,
        data: new Date(),
        criadoEm: new Date(),
        usuario: undefined,
      } as any);

      // Act
      await useCase.execute(usuarioId, dto);

      // Assert
      expect(repository.criar).toHaveBeenCalled();
    });
  });

  describe('Validações de Séries', () => {
    it('deve lançar exceção se séries for inválido', async () => {
      // Arrange
      const usuarioId = 'usuario-123';
      const dto: CreateTreinoDto = {
        exercicioNome: 'Supino Reto',
        carga: 80,
        repeticoes: 10,
        series: 0,
      } as any;

      // Act & Assert
      await expect(useCase.execute(usuarioId, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve usar série padrão (1) se não fornecida', async () => {
      // Arrange
      const usuarioId = 'usuario-123';
      const dto: CreateTreinoDto = {
        exercicioNome: 'Supino Reto',
        carga: 80,
        repeticoes: 10,
      } as any;

      repository.criar.mockResolvedValue({
        id: 'treino-123',
        usuarioId,
        exercicioNome: dto.exercicioNome,
        carga: dto.carga,
        repeticoes: dto.repeticoes,
        series: 1,
        observacoes: null,
        data: new Date(),
        criadoEm: new Date(),
        usuario: undefined,
      } as any);

      // Act
      await useCase.execute(usuarioId, dto);

      // Assert
      expect(repository.criar).toHaveBeenCalledWith(
        expect.objectContaining({
          series: 1,
        }),
      );
    });
  });

  describe('Associação com Usuário', () => {
    it('deve associar treino ao usuário correto', async () => {
      // Arrange
      const usuarioId = 'usuario-456';
      const dto: CreateTreinoDto = {
        exercicioNome: 'Supino Reto',
        carga: 80,
        repeticoes: 10,
        series: 3,
      } as any;

      repository.criar.mockResolvedValue({
        id: 'treino-123',
        usuarioId,
        exercicioNome: dto.exercicioNome,
        carga: dto.carga,
        repeticoes: dto.repeticoes,
        series: dto.series,
        observacoes: null,
        data: new Date(),
        criadoEm: new Date(),
        usuario: undefined,
      } as any);

      // Act
      await useCase.execute(usuarioId, dto);

      // Assert
      expect(repository.criar).toHaveBeenCalledWith(
        expect.objectContaining({
          usuarioId: 'usuario-456',
        }),
      );
    });
  });
});
