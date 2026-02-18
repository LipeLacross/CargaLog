import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeletarTreinoUseCase } from './deletar-treino.use-case';
import { ITreinoRepository } from '../../../domain/repositories/treino.repository.interface';
import { Treino } from '../../../domain/entities/treino.entity';

describe('DeletarTreinoUseCase', () => {
  let useCase: DeletarTreinoUseCase;
  let repository: jest.Mocked<ITreinoRepository>;

  const mockRepositorio: jest.Mocked<ITreinoRepository> = {
    criar: jest.fn(),
    buscarPorId: jest.fn(),
    listarPorUsuario: jest.fn(),
    atualizar: jest.fn(),
    deletar: jest.fn(),
    obterEstatisticas: jest.fn(),
  };

  const treinoExistente: Treino = {
    id: 'treino-123',
    usuarioId: 'usuario-123',
    exercicioNome: 'Supino Reto',
    carga: 80,
    repeticoes: 10,
    series: 3,
    observacoes: 'Treino para deletar',
    data: new Date('2026-01-01'),
    criadoEm: new Date(),
    usuario: undefined,
    calcularVolume: function (): number {
      return this.carga * this.repeticoes * this.series;
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeletarTreinoUseCase,
        {
          provide: 'ITreinoRepository',
          useValue: mockRepositorio,
        },
      ],
    }).compile();

    useCase = module.get<DeletarTreinoUseCase>(DeletarTreinoUseCase);
    repository =
      module.get<jest.Mocked<ITreinoRepository>>('ITreinoRepository');
  });

  describe('Caminho Feliz', () => {
    it('deve deletar treino com sucesso', async () => {
      // Arrange
      const treinoId = 'treino-123';
      const usuarioId = 'usuario-123';

      repository.buscarPorId.mockResolvedValue(treinoExistente);
      repository.deletar.mockResolvedValue(undefined);

      // Act
      await useCase.execute(treinoId, usuarioId);

      // Assert
      expect(repository.buscarPorId).toHaveBeenCalledWith(treinoId);
      expect(repository.deletar).toHaveBeenCalledWith(treinoId);
    });

    it('deve retornar void após deletar', async () => {
      // Arrange
      const treinoId = 'treino-123';
      const usuarioId = 'usuario-123';

      repository.buscarPorId.mockResolvedValue(treinoExistente);
      repository.deletar.mockResolvedValue(undefined);

      // Act
      const resultado = await useCase.execute(treinoId, usuarioId);

      // Assert
      expect(resultado).toBeUndefined();
    });
  });

  describe('Validações de Existência', () => {
    it('deve lançar NotFoundException se treino não existe', async () => {
      // Arrange
      const treinoId = 'treino-inexistente';
      const usuarioId = 'usuario-123';

      repository.buscarPorId.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(treinoId, usuarioId)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.deletar).not.toHaveBeenCalled();
    });

    it('deve rejeitar se treino com ID inválido', async () => {
      // Arrange
      const treinoId = '';
      const usuarioId = 'usuario-123';

      repository.buscarPorId.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(treinoId, usuarioId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Verificação de Propriedade', () => {
    it('deve lançar ForbiddenException se usuário não é dono', async () => {
      // Arrange
      const treinoId = 'treino-123';
      const usuarioIdDiferente = 'usuario-999';

      repository.buscarPorId.mockResolvedValue(treinoExistente);

      // Act & Assert
      await expect(
        useCase.execute(treinoId, usuarioIdDiferente),
      ).rejects.toThrow(ForbiddenException);
      expect(repository.deletar).not.toHaveBeenCalled();
    });

    it('deve verificar propriedade antes de deletar', async () => {
      // Arrange
      const treinoId = 'treino-123';
      const usuarioDiferente = 'usuario-diferente';

      repository.buscarPorId.mockResolvedValue(treinoExistente);

      // Act & Assert
      await expect(useCase.execute(treinoId, usuarioDiferente)).rejects.toThrow(
        ForbiddenException,
      );

      // Deletar não deve ser chamado
      expect(repository.deletar).not.toHaveBeenCalled();
    });
  });

  describe('Sequência de Operações', () => {
    it('deve buscar treino antes de deletar', async () => {
      // Arrange
      const treinoId = 'treino-123';
      const usuarioId = 'usuario-123';

      repository.buscarPorId.mockResolvedValue(treinoExistente);
      repository.deletar.mockResolvedValue(undefined);

      // Act
      await useCase.execute(treinoId, usuarioId);

      // Assert - buscarPorId deve ser chamado antes
      const callOrder = [
        repository.buscarPorId.mock.invocationCallOrder[0],
        repository.deletar.mock.invocationCallOrder[0],
      ];
      expect(callOrder[0]).toBeLessThan(callOrder[1]);
    });

    it('deve deletar o treino correto pelo ID', async () => {
      // Arrange
      const treinoId = 'treino-especifico-123';
      const usuarioId = 'usuario-123';

      repository.buscarPorId.mockResolvedValue(treinoExistente);
      repository.deletar.mockResolvedValue(undefined);

      // Act
      await useCase.execute(treinoId, usuarioId);

      // Assert
      expect(repository.deletar).toHaveBeenCalledWith(treinoId);
    });
  });

  describe('Casos de Borda', () => {
    it('deve permitir deletar mesmo que treino tenha observações vazias', async () => {
      // Arrange
      const treinoId = 'treino-123';
      const usuarioId = 'usuario-123';
      const treinoSemObservacoes: Treino = {
        ...treinoExistente,
        observacoes: null,
      };

      repository.buscarPorId.mockResolvedValue(treinoSemObservacoes);
      repository.deletar.mockResolvedValue(undefined);

      // Act
      await useCase.execute(treinoId, usuarioId);

      // Assert
      expect(repository.deletar).toHaveBeenCalled();
    });

    it('deve permitir deletar treino com data antiga', async () => {
      // Arrange
      const treinoId = 'treino-123';
      const usuarioId = 'usuario-123';
      const treinoAntigo: Treino = {
        ...treinoExistente,
        data: new Date('2020-01-01'),
      };

      repository.buscarPorId.mockResolvedValue(treinoAntigo);
      repository.deletar.mockResolvedValue(undefined);

      // Act
      await useCase.execute(treinoId, usuarioId);

      // Assert
      expect(repository.deletar).toHaveBeenCalledWith(treinoId);
    });
  });
});
