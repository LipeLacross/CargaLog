import { Test, TestingModule } from '@nestjs/testing';
import { ObterEstatisticasUseCase } from './obter-estatisticas.use-case';
import { IAnaliseRepository } from '../../../domain/repositories/analise.repository.interface';

describe('ObterEstatisticasUseCase', () => {
  let useCase: ObterEstatisticasUseCase;
  let repository: jest.Mocked<IAnaliseRepository>;

  const mockRepositorio: jest.Mocked<IAnaliseRepository> = {
    obterProgresso: jest.fn(),
    obterEstatisticas: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObterEstatisticasUseCase,
        {
          provide: 'IAnaliseRepository',
          useValue: mockRepositorio,
        },
      ],
    }).compile();

    useCase = module.get<ObterEstatisticasUseCase>(ObterEstatisticasUseCase);
    repository =
      module.get<jest.Mocked<IAnaliseRepository>>('IAnaliseRepository');
  });

  describe('Caminho Feliz', () => {
    it('deve obter estatísticas do usuário', async () => {
      // Arrange
      const usuarioId = 'usuario-123';

      const estatisticasMock = {
        totalTreinos: 50,
        exercicios: ['Supino Reto', 'Rosca Direta', 'Agachamento'],
        recordesPorExercicio: {
          'Supino Reto': 120,
          'Rosca Direta': 50,
          Agachamento: 180,
        },
      };

      repository.obterEstatisticas.mockResolvedValue(estatisticasMock);

      // Act
      const resultado = await useCase.execute(usuarioId);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado.totalTreinos).toBe(50);
      expect(resultado.exercicios).toHaveLength(3);
      expect(Object.keys(resultado.recordesPorExercicio)).toHaveLength(3);
      expect(repository.obterEstatisticas).toHaveBeenCalledWith(usuarioId);
    });
  });

  describe('Dados de Estatísticas', () => {
    it('deve retornar total de treinos', async () => {
      // Arrange
      const usuarioId = 'usuario-123';

      const estatisticasMock = {
        totalTreinos: 75,
        exercicios: ['Supino Reto'],
        recordesPorExercicio: {
          'Supino Reto': 150,
        },
      };

      repository.obterEstatisticas.mockResolvedValue(estatisticasMock);

      // Act
      const resultado = await useCase.execute(usuarioId);

      // Assert
      expect(resultado.totalTreinos).toBe(75);
    });

    it('deve retornar lista de exercícios únicos', async () => {
      // Arrange
      const usuarioId = 'usuario-123';

      const estatisticasMock = {
        totalTreinos: 100,
        exercicios: [
          'Supino Reto',
          'Supino Inclinado',
          'Rosca Direta',
          'Rosca Inversa',
          'Agachamento',
        ],
        recordesPorExercicio: {
          'Supino Reto': 120,
          'Supino Inclinado': 100,
          'Rosca Direta': 50,
          'Rosca Inversa': 45,
          Agachamento: 200,
        },
      };

      repository.obterEstatisticas.mockResolvedValue(estatisticasMock);

      // Act
      const resultado = await useCase.execute(usuarioId);

      // Assert
      expect(resultado.exercicios).toEqual([
        'Supino Reto',
        'Supino Inclinado',
        'Rosca Direta',
        'Rosca Inversa',
        'Agachamento',
      ]);
      expect(resultado.exercicios).toHaveLength(5);
    });

    it('deve retornar recordes por exercício', async () => {
      // Arrange
      const usuarioId = 'usuario-123';

      const estatisticasMock = {
        totalTreinos: 50,
        exercicios: ['Supino Reto', 'Rosca Direta'],
        recordesPorExercicio: {
          'Supino Reto': 150,
          'Rosca Direta': 60,
        },
      };

      repository.obterEstatisticas.mockResolvedValue(estatisticasMock);

      // Act
      const resultado = await useCase.execute(usuarioId);

      // Assert
      expect(resultado.recordesPorExercicio['Supino Reto']).toBeDefined();
      expect(resultado.recordesPorExercicio['Supino Reto'].cargaMaxima).toBe(
        150,
      );
      expect(resultado.recordesPorExercicio['Rosca Direta']).toBeDefined();
      expect(resultado.recordesPorExercicio['Rosca Direta'].cargaMaxima).toBe(
        60,
      );
    });
  });

  describe('Formatação de Resposta', () => {
    it('deve retornar DTO com estrutura correta', async () => {
      // Arrange
      const usuarioId = 'usuario-123';

      const estatisticasMock = {
        totalTreinos: 50,
        exercicios: ['Supino Reto'],
        recordesPorExercicio: {
          'Supino Reto': 120,
        },
      };

      repository.obterEstatisticas.mockResolvedValue(estatisticasMock);

      // Act
      const resultado = await useCase.execute(usuarioId);

      // Assert
      expect(resultado).toHaveProperty('totalTreinos');
      expect(resultado).toHaveProperty('exercicios');
      expect(resultado).toHaveProperty('recordesPorExercicio');
    });

    it('deve incluir data no recorde de cada exercício', async () => {
      // Arrange
      const usuarioId = 'usuario-123';

      const estatisticasMock = {
        totalTreinos: 30,
        exercicios: ['Supino Reto', 'Rosca Direta'],
        recordesPorExercicio: {
          'Supino Reto': 120,
          'Rosca Direta': 50,
        },
      };

      repository.obterEstatisticas.mockResolvedValue(estatisticasMock);

      // Act
      const resultado = await useCase.execute(usuarioId);

      // Assert
      expect(resultado.recordesPorExercicio['Supino Reto']).toHaveProperty(
        'cargaMaxima',
      );
      expect(resultado.recordesPorExercicio['Supino Reto']).toHaveProperty(
        'data',
      );
      expect(resultado.recordesPorExercicio['Rosca Direta']).toHaveProperty(
        'cargaMaxima',
      );
      expect(resultado.recordesPorExercicio['Rosca Direta']).toHaveProperty(
        'data',
      );
    });

    it('data do recorde deve ser um Date object', async () => {
      // Arrange
      const usuarioId = 'usuario-123';

      const estatisticasMock = {
        totalTreinos: 20,
        exercicios: ['Supino Reto'],
        recordesPorExercicio: {
          'Supino Reto': 150,
        },
      };

      repository.obterEstatisticas.mockResolvedValue(estatisticasMock);

      // Act
      const resultado = await useCase.execute(usuarioId);

      // Assert
      expect(resultado.recordesPorExercicio['Supino Reto'].data).toBeInstanceOf(
        Date,
      );
    });
  });

  describe('Casos de Borda', () => {
    it('deve lidar com usuário sem treinos', async () => {
      // Arrange
      const usuarioId = 'usuario-sem-treinos';

      const estatisticasMock = {
        totalTreinos: 0,
        exercicios: [],
        recordesPorExercicio: {},
      };

      repository.obterEstatisticas.mockResolvedValue(estatisticasMock);

      // Act
      const resultado = await useCase.execute(usuarioId);

      // Assert
      expect(resultado.totalTreinos).toBe(0);
      expect(resultado.exercicios).toHaveLength(0);
      expect(Object.keys(resultado.recordesPorExercicio)).toHaveLength(0);
    });

    it('deve lidar com exercício com recorde muito alto', async () => {
      // Arrange
      const usuarioId = 'usuario-forte';

      const estatisticasMock = {
        totalTreinos: 10,
        exercicios: ['Agachamento'],
        recordesPorExercicio: {
          Agachamento: 500,
        },
      };

      repository.obterEstatisticas.mockResolvedValue(estatisticasMock);

      // Act
      const resultado = await useCase.execute(usuarioId);

      // Assert
      expect(resultado.recordesPorExercicio['Agachamento'].cargaMaxima).toBe(
        500,
      );
    });
  });

  describe('Validações', () => {
    it('deve chamar repositório com usuarioId correto', async () => {
      // Arrange
      const usuarioId = 'usuario-especifico-456';

      repository.obterEstatisticas.mockResolvedValue({
        totalTreinos: 0,
        exercicios: [],
        recordesPorExercicio: {},
      });

      // Act
      await useCase.execute(usuarioId);

      // Assert
      expect(repository.obterEstatisticas).toHaveBeenCalledWith(
        'usuario-especifico-456',
      );
    });
  });
});
