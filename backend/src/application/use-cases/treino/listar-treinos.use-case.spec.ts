import { Test, TestingModule } from '@nestjs/testing';
import { ListarTreinosUseCase } from './listar-treinos.use-case';
import { ITreinoRepository } from '../../../domain/repositories/treino.repository.interface';
import { Treino } from '../../../domain/entities/treino.entity';

describe('ListarTreinosUseCase', () => {
  let useCase: ListarTreinosUseCase;
  let repository: jest.Mocked<ITreinoRepository>;

  const mockRepositorio: jest.Mocked<ITreinoRepository> = {
    criar: jest.fn(),
    buscarPorId: jest.fn(),
    listarPorUsuario: jest.fn(),
    atualizar: jest.fn(),
    deletar: jest.fn(),
    obterEstatisticas: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListarTreinosUseCase,
        {
          provide: 'ITreinoRepository',
          useValue: mockRepositorio,
        },
      ],
    }).compile();

    useCase = module.get<ListarTreinosUseCase>(ListarTreinosUseCase);
    repository =
      module.get<jest.Mocked<ITreinoRepository>>('ITreinoRepository');
  });

  describe('Caminho Feliz', () => {
    it('deve listar todos os treinos do usuário', async () => {
      // Arrange
      const usuarioId = 'usuario-123';
      const treinos: Treino[] = [
        {
          id: '1',
          usuarioId,
          exercicioNome: 'Supino Reto',
          carga: 80,
          repeticoes: 10,
          series: 3,
          observacoes: '',
          data: new Date(),
          criadoEm: new Date(),
          usuario: undefined,
          calcularVolume: function (): number {
            return this.carga * this.repeticoes * this.series;
          },
        },
        {
          id: '2',
          usuarioId,
          exercicioNome: 'Rosca Direta',
          carga: 20,
          repeticoes: 12,
          series: 4,
          observacoes: '',
          data: new Date(),
          criadoEm: new Date(),
          usuario: undefined,
          calcularVolume: function (): number {
            return this.carga * this.repeticoes * this.series;
          },
        },
      ];

      repository.listarPorUsuario.mockResolvedValue(treinos);

      // Act
      const resultado = await useCase.execute(usuarioId);

      // Assert
      expect(resultado).toHaveLength(2);
      expect(resultado[0].exercicioNome).toBe('Supino Reto');
      expect(resultado[1].exercicioNome).toBe('Rosca Direta');
      expect(repository.listarPorUsuario).toHaveBeenCalledWith(
        usuarioId,
        undefined,
      );
    });

    it('deve retornar array vazio se usuário não tem treinos', async () => {
      // Arrange
      const usuarioId = 'usuario-sem-treinos';
      repository.listarPorUsuario.mockResolvedValue([]);

      // Act
      const resultado = await useCase.execute(usuarioId);

      // Assert
      expect(resultado).toEqual([]);
    });
  });

  describe('Filtros Opcionais', () => {
    it('deve filtrar por exercício', async () => {
      // Arrange
      const usuarioId = 'usuario-123';
      const treinos: Treino[] = [
        {
          id: '1',
          usuarioId,
          exercicioNome: 'Supino Reto',
          carga: 80,
          repeticoes: 10,
          series: 3,
          observacoes: '',
          data: new Date(),
          criadoEm: new Date(),
          usuario: undefined,
          calcularVolume: function (): number {
            return this.carga * this.repeticoes * this.series;
          },
        },
      ];

      repository.listarPorUsuario.mockResolvedValue(treinos);

      const filtros = { exercicio: 'Supino Reto' };

      // Act
      const resultado = await useCase.execute(usuarioId, filtros);

      // Assert
      expect(repository.listarPorUsuario).toHaveBeenCalledWith(
        usuarioId,
        filtros,
      );
      expect(resultado).toHaveLength(1);
      expect(resultado[0].exercicioNome).toBe('Supino Reto');
    });

    it('deve filtrar por período (data início e fim)', async () => {
      // Arrange
      const usuarioId = 'usuario-123';
      const dataInicio = new Date('2026-01-01');
      const dataFim = new Date('2026-01-31');

      const treinos: Treino[] = [
        {
          id: '1',
          usuarioId,
          exercicioNome: 'Supino Reto',
          carga: 80,
          repeticoes: 10,
          series: 3,
          observacoes: '',
          data: new Date('2026-01-15'),
          criadoEm: new Date(),
          usuario: undefined,
          calcularVolume: function (): number {
            return this.carga * this.repeticoes * this.series;
          },
        },
      ];

      repository.listarPorUsuario.mockResolvedValue(treinos);

      const filtros = { dataInicio, dataFim };

      // Act
      await useCase.execute(usuarioId, filtros);

      // Assert
      expect(repository.listarPorUsuario).toHaveBeenCalledWith(
        usuarioId,
        filtros,
      );
    });

    it('deve combinar múltiplos filtros', async () => {
      // Arrange
      const usuarioId = 'usuario-123';
      const filtros = {
        exercicio: 'Supino Reto',
        dataInicio: new Date('2026-01-01'),
        dataFim: new Date('2026-01-31'),
      };

      repository.listarPorUsuario.mockResolvedValue([]);

      // Act
      await useCase.execute(usuarioId, filtros);

      // Assert
      expect(repository.listarPorUsuario).toHaveBeenCalledWith(
        usuarioId,
        filtros,
      );
    });
  });

  describe('Validações', () => {
    it('deve passar usuarioId corretamente ao repositório', async () => {
      // Arrange
      const usuarioId = 'usuario-especifico-123';
      repository.listarPorUsuario.mockResolvedValue([]);

      // Act
      await useCase.execute(usuarioId);

      // Assert
      expect(repository.listarPorUsuario).toHaveBeenCalledWith(
        'usuario-especifico-123',
        undefined,
      );
    });
  });
});
