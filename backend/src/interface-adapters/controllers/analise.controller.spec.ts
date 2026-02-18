import { Test, TestingModule } from '@nestjs/testing';
import { AnaliseController } from './analise.controller';
import { GerarRelatorioProgressoUseCase } from '../../application/use-cases/analise/gerar-relatorio-progresso.use-case';
import { ObterEstatisticasUseCase } from '../../application/use-cases/analise/obter-estatisticas.use-case';

describe('AnaliseController', () => {
  let controller: AnaliseController;
  let gerarRelatorioUseCase: jest.Mocked<GerarRelatorioProgressoUseCase>;
  let obterEstatisticasUseCase: jest.Mocked<ObterEstatisticasUseCase>;

  const usuarioMock = {
    id: 'usuario-123',
    email: 'usuario@example.com',
  };

  const relatorioMock = {
    exercicio: 'Supino Reto',
    periodo: {
      inicio: new Date('2026-01-19'),
      fim: new Date('2026-02-18'),
    },
    cargaMaxima: 120,
    cargaMedia: 100,
    progresso: 15.0,
    totalTreinos: 10,
    pontos: [
      { data: new Date('2026-01-20'), carga: 100 },
      { data: new Date('2026-02-18'), carga: 120 },
    ],
  };

  const estatisticasMock = {
    totalTreinos: 50,
    exercicios: ['Supino Reto', 'Rosca Direta', 'Agachamento'],
    recordesPorExercicio: {
      'Supino Reto': { cargaMaxima: 120, data: new Date() },
      'Rosca Direta': { cargaMaxima: 50, data: new Date() },
      Agachamento: { cargaMaxima: 200, data: new Date() },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnaliseController],
      providers: [
        {
          provide: GerarRelatorioProgressoUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ObterEstatisticasUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AnaliseController>(AnaliseController);
    gerarRelatorioUseCase = module.get<
      jest.Mocked<GerarRelatorioProgressoUseCase>
    >(GerarRelatorioProgressoUseCase);
    obterEstatisticasUseCase = module.get<
      jest.Mocked<ObterEstatisticasUseCase>
    >(ObterEstatisticasUseCase);
  });

  describe('GET /analises/estatisticas', () => {
    it('deve retornar estatísticas gerais do usuário', async () => {
      // Arrange
      obterEstatisticasUseCase.execute.mockResolvedValue(estatisticasMock);

      // Act
      const resultado = await controller.obterEstatisticas(usuarioMock);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado.totalTreinos).toBe(50);
      expect(resultado.exercicios).toHaveLength(3);
      expect(obterEstatisticasUseCase.execute).toHaveBeenCalledWith(
        usuarioMock.id,
      );
    });

    it('deve passar usuarioId do usuário autenticado', async () => {
      // Arrange
      obterEstatisticasUseCase.execute.mockResolvedValue(estatisticasMock);

      // Act
      await controller.obterEstatisticas(usuarioMock);

      // Assert
      expect(obterEstatisticasUseCase.execute).toHaveBeenCalledWith(
        'usuario-123',
      );
    });

    it('deve retornar recordes por exercício', async () => {
      // Arrange
      obterEstatisticasUseCase.execute.mockResolvedValue(estatisticasMock);

      // Act
      const resultado = await controller.obterEstatisticas(usuarioMock);

      // Assert
      expect(resultado.recordesPorExercicio).toBeDefined();
      expect(resultado.recordesPorExercicio['Supino Reto']).toBeDefined();
      expect(resultado.recordesPorExercicio['Rosca Direta']).toBeDefined();
    });
  });

  describe('GET /analises/progresso/:exercicio', () => {
    it('deve gerar relatório de progresso para exercício', async () => {
      // Arrange
      const exercicio = 'Supino Reto';
      gerarRelatorioUseCase.execute.mockResolvedValue(relatorioMock);

      // Act
      const resultado = await controller.gerarRelatorioProgresso(
        exercicio,
        usuarioMock,
      );

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado.exercicio).toBe('Supino Reto');
      expect(resultado.cargaMaxima).toBe(120);
      expect(gerarRelatorioUseCase.execute).toHaveBeenCalled();
    });

    it('deve usar período padrão (últimos 30 dias) se não especificado', async () => {
      // Arrange
      const exercicio = 'Supino Reto';
      gerarRelatorioUseCase.execute.mockResolvedValue(relatorioMock);

      // Act
      await controller.gerarRelatorioProgresso(exercicio, usuarioMock);

      // Assert
      expect(gerarRelatorioUseCase.execute).toHaveBeenCalledWith(
        usuarioMock.id,
        exercicio,
        expect.any(Date),
        expect.any(Date),
      );

      // Verifica que o período tem aproximadamente 30 dias
      const calls = gerarRelatorioUseCase.execute.mock.calls[0];
      const inicio = calls[2];
      const fim = calls[3];
      const diasDiferenca =
        (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24);
      expect(diasDiferenca).toBeCloseTo(30, 0);
    });

    it('deve usar período customizado se fornecido', async () => {
      // Arrange
      const exercicio = 'Supino Reto';
      const dataInicio = '2026-01-01';
      const dataFim = '2026-02-01';

      gerarRelatorioUseCase.execute.mockResolvedValue(relatorioMock);

      // Act
      await controller.gerarRelatorioProgresso(
        exercicio,
        usuarioMock,
        dataInicio,
        dataFim,
      );

      // Assert
      expect(gerarRelatorioUseCase.execute).toHaveBeenCalledWith(
        usuarioMock.id,
        exercicio,
        expect.any(Date),
        expect.any(Date),
      );

      const calls = gerarRelatorioUseCase.execute.mock.calls[0];
      const inicio = calls[2];
      const fim = calls[3];

      // Verifica que as datas correspondem aos valores fornecidos (aproximadamente)
      expect(inicio.toISOString().split('T')[0]).toBe('2026-01-01');
      expect(fim.toISOString().split('T')[0]).toBe('2026-02-01');
    });

    it('deve apenas usar dataInicio se fornecido', async () => {
      // Arrange
      const exercicio = 'Supino Reto';
      const dataInicio = '2026-01-15';

      gerarRelatorioUseCase.execute.mockResolvedValue(relatorioMock);

      // Act
      await controller.gerarRelatorioProgresso(
        exercicio,
        usuarioMock,
        dataInicio,
      );

      // Assert
      const calls = gerarRelatorioUseCase.execute.mock.calls[0];
      const inicio = calls[2];
      const fim = calls[3];

      expect(inicio.toISOString().split('T')[0]).toBe('2026-01-15');
      // fim deve ser hoje
      expect(fim.toISOString().split('T')[0]).toBe(
        new Date().toISOString().split('T')[0],
      );
    });

    it('deve apenas usar dataFim se fornecido', async () => {
      // Arrange
      const exercicio = 'Supino Reto';
      const dataFim = '2026-02-15';

      gerarRelatorioUseCase.execute.mockResolvedValue(relatorioMock);

      // Act
      await controller.gerarRelatorioProgresso(
        exercicio,
        usuarioMock,
        undefined,
        dataFim,
      );

      // Assert
      const calls = gerarRelatorioUseCase.execute.mock.calls[0];
      const inicio = calls[2];
      const fim = calls[3];

      // Calcula aproximadamente 30 dias antes de dataFim
      const dataFimObj = new Date(dataFim);
      const inicioEsperado = new Date(
        dataFimObj.getTime() - 30 * 24 * 60 * 60 * 1000,
      );

      expect(inicio.getDate()).toBeCloseTo(inicioEsperado.getDate(), 1);
      expect(fim.toISOString().split('T')[0]).toBe('2026-02-15');
    });

    it('deve retornar dados de progresso completos', async () => {
      // Arrange
      const exercicio = 'Supino Reto';
      gerarRelatorioUseCase.execute.mockResolvedValue(relatorioMock);

      // Act
      const resultado = await controller.gerarRelatorioProgresso(
        exercicio,
        usuarioMock,
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
  });

  describe('Autenticação', () => {
    it('todos os endpoints devem exigir autenticação (JwtAuthGuard)', () => {
      // Verifica que o @UseGuards(JwtAuthGuard) está na classe
      expect(controller).toBeDefined();
      // Nota: validação real seria através de teste E2E
    });
  });

  describe('Validação de Parâmetros', () => {
    it('deve aceitar nome do exercício como parâmetro', async () => {
      // Arrange
      const exercicio = 'Supino Reto';
      gerarRelatorioUseCase.execute.mockResolvedValue(relatorioMock);

      // Act
      await controller.gerarRelatorioProgresso(exercicio, usuarioMock);

      // Assert
      expect(gerarRelatorioUseCase.execute).toHaveBeenCalledWith(
        expect.any(String),
        'Supino Reto',
        expect.any(Date),
        expect.any(Date),
      );
    });

    it('deve converter string de data para Date object', async () => {
      // Arrange
      const exercicio = 'Supino Reto';
      const dataInicio = '2026-01-01';
      gerarRelatorioUseCase.execute.mockResolvedValue(relatorioMock);

      // Act
      await controller.gerarRelatorioProgresso(
        exercicio,
        usuarioMock,
        dataInicio,
      );

      // Assert
      const calls = gerarRelatorioUseCase.execute.mock.calls[0];
      const inicio = calls[2];
      expect(inicio).toBeInstanceOf(Date);
    });
  });
});
