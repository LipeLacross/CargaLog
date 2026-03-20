import { vi, describe, it, expect } from 'vitest';
import { Repository } from 'typeorm';
import { TypeOrmTreinoRepository } from './typeorm-treino.repository';
import { Treino } from '../../domain/entities/treino.entity';

const buildQueryBuilder = <T>(result: T[]) => {
  const qb = {
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    addOrderBy: vi.fn().mockReturnThis(),
    andWhere: vi.fn().mockReturnThis(),
    getMany: vi.fn().mockResolvedValue(result),
  };
  return qb;
};

describe('TypeOrmTreinoRepository', () => {
  let repository: TypeOrmTreinoRepository;
  let ormRepository: vi.Mocked<Repository<Treino>>;

  const buildTreino = (overrides: Partial<Treino> = {}): Treino => ({
    id: 'treino-1',
    usuarioId: 'user-1',
    usuario: {} as any,
    exercicioNome: 'Supino',
    carga: 100,
    repeticoes: 10,
    series: 3,
    observacoes: 'ok',
    data: new Date('2025-01-01'),
    criadoEm: new Date('2025-01-02'),
    ...overrides,
  });

  beforeEach(() => {
    ormRepository = {
      create: vi.fn(),
      save: vi.fn(),
      findOne: vi.fn(),
      find: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      createQueryBuilder: vi.fn(),
    } as unknown as vi.Mocked<Repository<Treino>>;

    repository = new TypeOrmTreinoRepository(ormRepository);
  });

  it('deve criar treino', async () => {
    const input = { exercicioNome: 'Supino', carga: 100, repeticoes: 10 };
    const treino = buildTreino();

    ormRepository.create.mockReturnValue(treino);
    ormRepository.save.mockResolvedValue(treino);

    const result = await repository.criar(input);

    expect(ormRepository.create).toHaveBeenCalledWith(input);
    expect(ormRepository.save).toHaveBeenCalledWith(treino);
    expect(result).toEqual(treino);
  });

  it('deve listar treinos por usuario sem filtros', async () => {
    const treinos = [buildTreino()];
    const qb = buildQueryBuilder(treinos);
    ormRepository.createQueryBuilder.mockReturnValue(qb as any);

    const result = await repository.listarPorUsuario('user-1');

    expect(ormRepository.createQueryBuilder).toHaveBeenCalledWith('treino');
    expect(qb.where).toHaveBeenCalledWith('treino.usuarioId = :usuarioId', {
      usuarioId: 'user-1',
    });
    expect(result).toEqual(treinos);
  });

  it('deve aplicar filtro por exercicio', async () => {
    const treinos = [buildTreino({ exercicioNome: 'Agachamento' })];
    const qb = buildQueryBuilder(treinos);
    ormRepository.createQueryBuilder.mockReturnValue(qb as any);

    await repository.listarPorUsuario('user-1', { exercicio: 'Agachamento' });

    expect(qb.andWhere).toHaveBeenCalledWith(
      'treino.exercicioNome = :exercicio',
      {
        exercicio: 'Agachamento',
      },
    );
  });

  it('deve aplicar filtro por periodo', async () => {
    const treinos = [buildTreino()];
    const qb = buildQueryBuilder(treinos);
    ormRepository.createQueryBuilder.mockReturnValue(qb as any);
    const inicio = new Date('2025-01-01');
    const fim = new Date('2025-01-31');

    await repository.listarPorUsuario('user-1', {
      dataInicio: inicio,
      dataFim: fim,
    });

    expect(qb.andWhere).toHaveBeenCalledWith(
      'treino.data BETWEEN :dataInicio AND :dataFim',
      { dataInicio: inicio, dataFim: fim },
    );
  });

  it('deve buscar treinos por exercicio', async () => {
    const treinos = [buildTreino({ exercicioNome: 'Supino' })];
    ormRepository.find.mockResolvedValue(treinos);

    const result = await repository.buscarPorExercicio('user-1', 'Supino');

    expect(ormRepository.find).toHaveBeenCalledWith({
      where: { usuarioId: 'user-1', exercicioNome: 'Supino' },
      order: { data: 'DESC', criadoEm: 'DESC' },
    });
    expect(result).toEqual(treinos);
  });

  it('deve atualizar treino', async () => {
    const treinoAtualizado = buildTreino({ carga: 110 });
    ormRepository.update.mockResolvedValue({} as any);
    ormRepository.findOne.mockResolvedValue(treinoAtualizado);

    const result = await repository.atualizar('treino-1', { carga: 110 });

    expect(ormRepository.update).toHaveBeenCalledWith('treino-1', {
      carga: 110,
    });
    expect(result).toEqual(treinoAtualizado);
  });

  it('deve lançar erro ao atualizar treino inexistente', async () => {
    ormRepository.update.mockResolvedValue({} as any);
    ormRepository.findOne.mockResolvedValue(null);

    await expect(
      repository.atualizar('treino-1', { carga: 110 }),
    ).rejects.toThrow('Treino não encontrado após atualização');
  });

  it('deve deletar treino', async () => {
    ormRepository.delete.mockResolvedValue({} as any);

    await repository.deletar('treino-1');

    expect(ormRepository.delete).toHaveBeenCalledWith('treino-1');
  });

  it('deve buscar ultimo treino por exercicio', async () => {
    const treino = buildTreino();
    ormRepository.findOne.mockResolvedValue(treino);

    const result = await repository.buscarUltimoPorExercicio(
      'user-1',
      'Supino',
    );

    expect(ormRepository.findOne).toHaveBeenCalledWith({
      where: { usuarioId: 'user-1', exercicioNome: 'Supino' },
      order: { data: 'DESC', criadoEm: 'DESC' },
    });
    expect(result).toEqual(treino);
  });

  it('deve contar treinos por usuario', async () => {
    ormRepository.count.mockResolvedValue(4);

    const result = await repository.contarPorUsuario('user-1');

    expect(ormRepository.count).toHaveBeenCalledWith({
      where: { usuarioId: 'user-1' },
    });
    expect(result).toBe(4);
  });
});
