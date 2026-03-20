import { vi, describe, it, expect } from 'vitest';
import { Repository } from 'typeorm';
import { TypeOrmAnaliseRepository } from './typeorm-analise.repository';
import { Treino } from '../../domain/entities/treino.entity';

const buildQueryBuilder = <T>(result: T[]) => {
  const qb = {
    select: vi.fn().mockReturnThis(),
    addSelect: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    andWhere: vi.fn().mockReturnThis(),
    groupBy: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    getRawMany: vi.fn().mockResolvedValue(result),
    getRawOne: vi.fn().mockResolvedValue(result[0] || null),
    getMany: vi.fn().mockResolvedValue(result as any),
  };
  return qb;
};

describe('TypeOrmAnaliseRepository', () => {
  let repository: TypeOrmAnaliseRepository;
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
      count: vi.fn(),
      createQueryBuilder: vi.fn(),
    } as unknown as vi.Mocked<Repository<Treino>>;

    repository = new TypeOrmAnaliseRepository(ormRepository);
  });

  it('deve obter estatisticas', async () => {
    ormRepository.count.mockResolvedValue(3);

    const exerciciosQb = buildQueryBuilder([{ exercicio: 'Supino' }]);
    const recordesQb = buildQueryBuilder([
      { exercicio: 'Supino', cargaMaxima: '120' },
    ]);
    const volumeQb = buildQueryBuilder([{ volume: '1800' }]);
    const maisTrainadoQb = buildQueryBuilder([
      { nome: 'Supino', quantidade: '10' },
    ]);

    ormRepository.createQueryBuilder
      .mockReturnValueOnce(exerciciosQb as any)
      .mockReturnValueOnce(recordesQb as any)
      .mockReturnValueOnce(volumeQb as any)
      .mockReturnValueOnce(maisTrainadoQb as any);

    const result = await repository.obterEstatisticas('user-1');

    expect(result.totalTreinos).toBe(3);
    expect(result.exercicios).toEqual(['Supino']);
    expect(result.recordesPorExercicio).toEqual({ Supino: 120 });
    expect(result.totalVolume).toBe(1800);
    expect(result.exercicioMaisTreinado).toEqual({
      nome: 'Supino',
      quantidade: 10,
    });
  });

  it('deve obter progresso com treinos no periodo', async () => {
    const treinos = [
      buildTreino({ carga: 80, data: new Date('2025-01-01') }),
      buildTreino({ carga: 100, data: new Date('2025-01-15') }),
    ];

    const progressoQb = buildQueryBuilder(treinos);
    ormRepository.createQueryBuilder.mockReturnValueOnce(progressoQb as any);

    const result = await repository.obterProgresso(
      'user-1',
      'Supino',
      new Date('2025-01-01'),
      new Date('2025-01-31'),
    );

    expect(result.cargaMaxima).toBe(100);
    expect(result.cargaMedia).toBeGreaterThan(0);
    expect(result.pontos).toHaveLength(2);
  });

  it('deve obter evolucao de carga', async () => {
    const evolucaoQb = buildQueryBuilder([
      { data: '2025-01-01', cargaMaxima: '90' },
      { data: '2025-01-02', cargaMaxima: '100' },
    ]);

    ormRepository.createQueryBuilder.mockReturnValueOnce(evolucaoQb as any);

    const result = await repository.obterEvolucaoCarga('user-1', 'Supino');

    expect(result).toHaveLength(2);
    expect(result[0].cargaMaxima).toBe(90);
  });

  it('deve comparar exercicios', async () => {
    const comparacaoQb = buildQueryBuilder([
      {
        exercicio: 'Supino',
        totalTreinos: '3',
        cargaMaxima: '120',
        cargaMedia: '100',
      },
    ]);

    ormRepository.createQueryBuilder.mockReturnValueOnce(comparacaoQb as any);

    const result = await repository.compararExercicios('user-1', ['Supino']);

    expect(result).toEqual([
      {
        exercicio: 'Supino',
        totalTreinos: 3,
        cargaMaxima: 120,
        cargaMedia: 100,
      },
    ]);
  });
});
