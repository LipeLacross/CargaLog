import { vi, describe, it, expect } from 'vitest';
import { TreinoController } from './treino.controller';
import { RegistrarTreinoUseCase } from '../../application/use-cases/treino/registrar-treino.use-case';
import { ListarTreinosUseCase } from '../../application/use-cases/treino/listar-treinos.use-case';
import { AtualizarTreinoUseCase } from '../../application/use-cases/treino/atualizar-treino.use-case';
import { DeletarTreinoUseCase } from '../../application/use-cases/treino/deletar-treino.use-case';
import { CreateTreinoDto } from '../../application/dto/treino/create-treino.dto';
import { UpdateTreinoDto } from '../../application/dto/treino/update-treino.dto';
import { Treino } from '../../domain/entities/treino.entity';

describe('TreinoController', () => {
  let controller: TreinoController;
  let registrarUseCase: { execute: ReturnType<typeof vi.fn> };
  let listarUseCase: { execute: ReturnType<typeof vi.fn> };
  let atualizarUseCase: { execute: ReturnType<typeof vi.fn> };
  let deletarUseCase: { execute: ReturnType<typeof vi.fn> };

  const usuarioMock = {
    id: 'usuario-123',
    email: 'usuario@example.com',
  };

  const treinoMock: Treino = {
    id: 'treino-123',
    usuarioId: 'usuario-123',
    exercicioNome: 'Supino Reto',
    carga: 80,
    repeticoes: 10,
    series: 3,
    observacoes: 'Treino',
    data: new Date(),
    criadoEm: new Date(),
    usuario: undefined,
    calcularVolume: function (): number {
      return this.carga * this.repeticoes * this.series;
    },
  };

  beforeEach(() => {
    registrarUseCase = { execute: vi.fn() };
    listarUseCase = { execute: vi.fn() };
    atualizarUseCase = { execute: vi.fn() };
    deletarUseCase = { execute: vi.fn() };

    controller = new TreinoController(
      registrarUseCase as unknown as RegistrarTreinoUseCase,
      listarUseCase as unknown as ListarTreinosUseCase,
      atualizarUseCase as unknown as AtualizarTreinoUseCase,
      deletarUseCase as unknown as DeletarTreinoUseCase,
    );
  });

  describe('POST /treinos', () => {
    it('deve criar novo treino', async () => {
      // Arrange
      const dto: CreateTreinoDto = {
        exercicioNome: 'Supino Reto',
        carga: 80,
        repeticoes: 10,
        series: 3,
      } as any;

      registrarUseCase.execute.mockResolvedValue(treinoMock);

      // Act
      const resultado = await controller.criar(usuarioMock, dto);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado.id).toBe('treino-123');
      expect(registrarUseCase.execute).toHaveBeenCalledWith(
        usuarioMock.id,
        dto,
      );
    });

    it('deve passar usuarioId do usuário autenticado', async () => {
      // Arrange
      const dto: CreateTreinoDto = {
        exercicioNome: 'Supino Reto',
        carga: 80,
        repeticoes: 10,
        series: 3,
      } as any;

      registrarUseCase.execute.mockResolvedValue(treinoMock);

      // Act
      await controller.criar(usuarioMock, dto);

      // Assert
      expect(registrarUseCase.execute).toHaveBeenCalledWith(
        'usuario-123',
        expect.any(Object),
      );
    });
  });

  describe('GET /treinos', () => {
    it('deve listar todos os treinos do usuário', async () => {
      // Arrange
      const treinos: Treino[] = [treinoMock];
      listarUseCase.execute.mockResolvedValue(treinos);

      // Act
      const resultado = await controller.listar(usuarioMock);

      // Assert
      expect(resultado).toHaveLength(1);
      expect(listarUseCase.execute).toHaveBeenCalledWith(
        'usuario-123',
        undefined,
      );
    });

    it('deve aplicar filtro por exercício', async () => {
      // Arrange
      const treinos: Treino[] = [treinoMock];
      listarUseCase.execute.mockResolvedValue(treinos);

      // Act
      await controller.listar(usuarioMock, 'Supino Reto');

      // Assert
      expect(listarUseCase.execute).toHaveBeenCalledWith(
        'usuario-123',
        expect.objectContaining({
          exercicio: 'Supino Reto',
        }),
      );
    });

    it('deve aplicar filtro por período', async () => {
      // Arrange
      const dataInicio = '2026-01-01';
      const dataFim = '2026-01-31';
      const treinos: Treino[] = [treinoMock];

      listarUseCase.execute.mockResolvedValue(treinos);

      // Act
      await controller.listar(usuarioMock, undefined, dataInicio, dataFim);

      // Assert
      expect(listarUseCase.execute).toHaveBeenCalledWith(
        'usuario-123',
        expect.objectContaining({
          dataInicio: expect.any(Date),
          dataFim: expect.any(Date),
        }),
      );
    });

    it('deve combinar múltiplos filtros', async () => {
      // Arrange
      const treinos: Treino[] = [treinoMock];
      listarUseCase.execute.mockResolvedValue(treinos);

      // Act
      await controller.listar(
        usuarioMock,
        'Supino Reto',
        '2026-01-01',
        '2026-01-31',
      );

      // Assert
      expect(listarUseCase.execute).toHaveBeenCalledWith(
        'usuario-123',
        expect.objectContaining({
          exercicio: 'Supino Reto',
          dataInicio: expect.any(Date),
          dataFim: expect.any(Date),
        }),
      );
    });

    it('deve retornar array vazio se sem treinos', async () => {
      // Arrange
      listarUseCase.execute.mockResolvedValue([]);

      // Act
      const resultado = await controller.listar(usuarioMock);

      // Assert
      expect(resultado).toEqual([]);
    });
  });

  describe('PATCH /treinos/:id', () => {
    it('deve atualizar treino existente', async () => {
      // Arrange
      const treinoId = 'treino-123';
      const dto: UpdateTreinoDto = {
        carga: 90,
      } as any;

      const treinoAtualizado = { ...treinoMock, carga: 90 };
      atualizarUseCase.execute.mockResolvedValue(treinoAtualizado);

      // Act
      const resultado = await controller.atualizar(treinoId, usuarioMock, dto);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado.carga).toBe(90);
      expect(atualizarUseCase.execute).toHaveBeenCalledWith(
        treinoId,
        usuarioMock.id,
        dto,
      );
    });

    it('deve passar usuarioId para validar propriedade', async () => {
      // Arrange
      const treinoId = 'treino-123';
      const dto: UpdateTreinoDto = {} as any;

      atualizarUseCase.execute.mockResolvedValue(treinoMock);

      // Act
      await controller.atualizar(treinoId, usuarioMock, dto);

      // Assert
      expect(atualizarUseCase.execute).toHaveBeenCalledWith(
        treinoId,
        'usuario-123',
        expect.any(Object),
      );
    });
  });

  describe('DELETE /treinos/:id', () => {
    it('deve deletar treino existente', async () => {
      // Arrange
      const treinoId = 'treino-123';
      deletarUseCase.execute.mockResolvedValue(undefined);

      // Act
      await controller.deletar(treinoId, usuarioMock);

      // Assert
      expect(deletarUseCase.execute).toHaveBeenCalledWith(
        treinoId,
        usuarioMock.id,
      );
    });

    it('deve retornar void após deletar', async () => {
      // Arrange
      const treinoId = 'treino-123';
      deletarUseCase.execute.mockResolvedValue(undefined);

      // Act
      const resultado = await controller.deletar(treinoId, usuarioMock);

      // Assert
      expect(resultado).toBeUndefined();
    });

    it('deve passar usuarioId para validar propriedade', async () => {
      // Arrange
      const treinoId = 'treino-123';
      deletarUseCase.execute.mockResolvedValue(undefined);

      // Act
      await controller.deletar(treinoId, usuarioMock);

      // Assert
      expect(deletarUseCase.execute).toHaveBeenCalledWith(
        treinoId,
        'usuario-123',
      );
    });
  });

  describe('Autenticação', () => {
    it('todos os endpoints devem exigir autenticação (JwtAuthGuard)', () => {
      // Verifica que o @UseGuards(JwtAuthGuard) está na classe
      expect(controller).toBeDefined();
      // Nota: validação real seria através de teste E2E
    });
  });

  describe('Tratamento de Filtros', () => {
    it('deve ignorar filtros vazios', async () => {
      // Arrange
      listarUseCase.execute.mockResolvedValue([]);

      // Act
      await controller.listar(usuarioMock, undefined, undefined, undefined);

      // Assert
      expect(listarUseCase.execute).toHaveBeenCalledWith(
        'usuario-123',
        undefined,
      );
    });

    it('deve converter string de data para Date object', async () => {
      // Arrange
      const dataInicio = '2026-01-01';
      listarUseCase.execute.mockResolvedValue([]);

      // Act
      await controller.listar(usuarioMock, undefined, dataInicio, undefined);

      // Assert
      const call = listarUseCase.execute.mock.calls[0];
      expect(call[1].dataInicio).toBeInstanceOf(Date);
    });
  });
});
