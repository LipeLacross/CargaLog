import { Test, TestingModule } from '@nestjs/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { GerarRelatorioProgressoUseCase } from './gerar-relatorio-progresso.use-case';
import { IAnaliseRepository } from '../../../domain/repositories/analise.repository.interface';

describe('GerarRelatorioProgressoUseCase', () => {
  let useCase: GerarRelatorioProgressoUseCase;
  let repository: vi.Mocked<IAnaliseRepository>;

  const mockRepositorio: vi.Mocked<IAnaliseRepository> = {
    obterProgresso: vi.fn(),
    obterEstatisticas: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GerarRelatorioProgressoUseCase,
        {
          provide: 'IAnaliseRepository',
          useValue: mockRepositorio,
        },
      ],
    }).compile();

    useCase = module.get<GerarRelatorioProgressoUseCase>(
      GerarRelatorioProgressoUseCase,
    );
    repository =
      module.get<vi.Mocked<IAnaliseRepository>>('IAnaliseRepository');
  });

  describe('Caminho Feliz', () => {
    it('deve gerar relatório de progresso com dados válidos', async () => {
      // Arrange
      const usuarioId = 'usuario-123';
      const exercicio = 'Supino Reto';
      const periodoInicio = new Date('2026-01-01');
      const periodoFim = new Date('2026-02-01');

      const progressoMock = {
        exercicio,
        periodo: {
          inicio: periodoInicio,
          fim: periodoFim,
        },
        cargaMaxima: 100,
        cargaMedia: 85,
        progresso: 12.5,
        pontos: [
          { data: new Date('2026-01-05'), carga: 80 },
          { data: new Date('2026-01-12'), carga: 85 },
          { data: new Date('2026-01-19'), carga: 90 },
          { data: new Date('2026-01-26'), carga: 100 },
        ],
      };

      repository.obterProgresso.mockResolvedValue(progressoMock);

      // Act
      const resultado = await useCase.execute(
        usuarioId,
        exercicio,
        periodoInicio,
        periodoFim,
      );

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado.exercicio).toBe(exercicio);
      expect(resultado.cargaMaxima).toBe(100);
      expect(resultado.cargaMedia).toBe(85);
      expect(resultado.totalTreinos).toBe(4);
      expect(repository.obterProgresso).toHaveBeenCalledWith(
        usuarioId,
        exercicio,
        periodoInicio,
        periodoFim,
      );
    });
  });

  describe('Cálculos de Métricas', () => {
    it('deve retornar carga máxima correta', async () => {
      // Arrange
      const usuarioId = 'usuario-123';
      const exercicio = 'Supino Reto';
      const periodoInicio = new Date('2026-01-01');
      const periodoFim = new Date('2026-02-01');

      const progressoMock = {
        exercicio,
        periodo: { inicio: periodoInicio, fim: periodoFim },
        cargaMaxima: 120,
        cargaMedia: 95,
        progresso: 20,
        pontos: [
          { data: new Date('2026-01-05'), carga: 100 },
          { data: new Date('2026-01-20'), carga: 120 },
        ],
      };

      repository.obterProgresso.mockResolvedValue(progressoMock);

      // Act
      const resultado = await useCase.execute(
        usuarioId,
        exercicio,
        periodoInicio,
        periodoFim,
      );

      // Assert
      expect(resultado.cargaMaxima).toBe(120);
    });

    it('deve retornar carga média correta', async () => {
      // Arrange
      const usuarioId = 'usuario-123';
      const exercicio = 'Rosca Direta';
      const periodoInicio = new Date('2026-01-01');
      const periodoFim = new Date('2026-02-01');

      const progressoMock = {
        exercicio,
        periodo: { inicio: periodoInicio, fim: periodoFim },
        cargaMaxima: 50,
        cargaMedia: 40,
        progresso: 15,
        pontos: [
          { data: new Date('2026-01-05'), carga: 35 },
          { data: new Date('2026-01-15'), carga: 40 },
          { data: new Date('2026-01-25'), carga: 45 },
        ],
      };

      repository.obterProgresso.mockResolvedValue(progressoMock);

      // Act
      const resultado = await useCase.execute(
        usuarioId,
        exercicio,
        periodoInicio,
        periodoFim,
      );

      // Assert
      expect(resultado.cargaMedia).toBe(40);
    });

    it('deve calcular percentual de progresso', async () => {
      // Arrange
      const usuarioId = 'usuario-123';
      const exercicio = 'Supino Reto';
      const periodoInicio = new Date('2026-01-01');
      const periodoFim = new Date('2026-02-01');

      const progressoMock = {
        exercicio,
        periodo: { inicio: periodoInicio, fim: periodoFim },
        cargaMaxima: 110,
        cargaMedia: 90,
        progresso: 10.0, // 10% de progresso
        pontos: [
          { data: new Date('2026-01-05'), carga: 100 },
          { data: new Date('2026-02-01'), carga: 110 },
        ],
      };

      repository.obterProgresso.mockResolvedValue(progressoMock);

      // Act
      const resultado = await useCase.execute(
        usuarioId,
        exercicio,
        periodoInicio,
        periodoFim,
      );

      // Assert
      expect(resultado.progresso).toBe(10.0);
    });
  });

  describe('Formatação de Resposta', () => {
    it('deve retornar DTO com estrutura correta', async () => {
      // Arrange
      const usuarioId = 'usuario-123';
      const exercicio = 'Supino Reto';
      const periodoInicio = new Date('2026-01-01');
      const periodoFim = new Date('2026-02-01');

      const progressoMock = {
        exercicio,
        periodo: { inicio: periodoInicio, fim: periodoFim },
        cargaMaxima: 100,
        cargaMedia: 85,
        progresso: 12.5,
        pontos: [{ data: new Date('2026-01-05'), carga: 80 }],
      };

      repository.obterProgresso.mockResolvedValue(progressoMock);

      // Act
      const resultado = await useCase.execute(
        usuarioId,
        exercicio,
        periodoInicio,
        periodoFim,
      );

      // Assert
      expect(resultado).toHaveProperty('exercicio');
      expect(resultado).toHaveProperty('periodo');
      expect(resultado).toHaveProperty('cargaMaxima');
      expect(resultado).toHaveProperty('cargaMedia');
      expect(resultado).toHaveProperty('progresso');
      expect(resultado).toHaveProperty('totalTreinos');
      expect(resultado).toHaveProperty('pontos');
    });

    it('deve contar corretamente o total de treinos', async () => {
      // Arrange
      const usuarioId = 'usuario-123';
      const exercicio = 'Supino Reto';
      const periodoInicio = new Date('2026-01-01');
      const periodoFim = new Date('2026-02-01');

      const pontos = [
        { data: new Date('2026-01-05'), carga: 80 },
        { data: new Date('2026-01-10'), carga: 85 },
        { data: new Date('2026-01-15'), carga: 90 },
        { data: new Date('2026-01-20'), carga: 95 },
        { data: new Date('2026-01-25'), carga: 100 },
      ];

      const progressoMock = {
        exercicio,
        periodo: { inicio: periodoInicio, fim: periodoFim },
        cargaMaxima: 100,
        cargaMedia: 90,
        progresso: 20,
        pontos,
      };

      repository.obterProgresso.mockResolvedValue(progressoMock);

      // Act
      const resultado = await useCase.execute(
        usuarioId,
        exercicio,
        periodoInicio,
        periodoFim,
      );

      // Assert
      expect(resultado.totalTreinos).toBe(5);
      expect(resultado.pontos).toHaveLength(5);
    });
  });

  describe('Validações', () => {
    it('deve passar periodo correto ao repositório', async () => {
      // Arrange
      const usuarioId = 'usuario-123';
      const exercicio = 'Supino Reto';
      const periodoInicio = new Date('2026-01-01');
      const periodoFim = new Date('2026-01-31');

      repository.obterProgresso.mockResolvedValue({
        exercicio,
        periodo: { inicio: periodoInicio, fim: periodoFim },
        cargaMaxima: 100,
        cargaMedia: 85,
        progresso: 12.5,
        pontos: [],
      });

      // Act
      await useCase.execute(usuarioId, exercicio, periodoInicio, periodoFim);

      // Assert
      expect(repository.obterProgresso).toHaveBeenCalledWith(
        usuarioId,
        exercicio,
        periodoInicio,
        periodoFim,
      );
    });
  });
});
