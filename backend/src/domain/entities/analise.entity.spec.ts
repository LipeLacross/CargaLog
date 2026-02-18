import { Analise } from './analise.entity';
import { Usuario } from './usuario.entity';

describe('Analise Entity', () => {
  describe('Criação', () => {
    it('deve criar uma instância válida de Analise', () => {
      // Arrange & Act
      const analise = new Analise();
      analise.exercicioNome = 'Supino Reto';
      analise.periodoInicio = new Date('2026-01-01');
      analise.periodoFim = new Date('2026-02-18');
      analise.cargaMaxima = 100;
      analise.cargaMedia = 85;
      analise.totalTreinos = 12;

      // Assert
      expect(analise).toBeDefined();
      expect(analise.exercicioNome).toBe('Supino Reto');
      expect(analise.cargaMaxima).toBe(100);
      expect(analise.cargaMedia).toBe(85);
      expect(analise.totalTreinos).toBe(12);
    });
  });

  describe('Cálculo de Progresso', () => {
    it('deve calcular progresso positivo corretamente', () => {
      // Arrange
      const cargaInicial = 80;
      const cargaFinal = 100;

      // Act
      const progresso = Analise.calcularProgresso(cargaInicial, cargaFinal);

      // Assert
      expect(progresso).toBe(25); // (100-80)/80 * 100 = 25%
    });

    it('deve calcular progresso negativo (regressão)', () => {
      // Arrange
      const cargaInicial = 100;
      const cargaFinal = 80;

      // Act
      const progresso = Analise.calcularProgresso(cargaInicial, cargaFinal);

      // Assert
      expect(progresso).toBe(-20); // (80-100)/100 * 100 = -20%
    });

    it('deve retornar 0 quando carga inicial é zero', () => {
      // Arrange
      const cargaInicial = 0;
      const cargaFinal = 50;

      // Act
      const progresso = Analise.calcularProgresso(cargaInicial, cargaFinal);

      // Assert
      expect(progresso).toBe(0);
    });

    it('deve retornar 0 quando não há progresso', () => {
      // Arrange
      const cargaInicial = 100;
      const cargaFinal = 100;

      // Act
      const progresso = Analise.calcularProgresso(cargaInicial, cargaFinal);

      // Assert
      expect(progresso).toBe(0);
    });

    it('deve calcular progresso com valores decimais', () => {
      // Arrange
      const cargaInicial = 50.5;
      const cargaFinal = 60.6;

      // Act
      const progresso = Analise.calcularProgresso(cargaInicial, cargaFinal);

      // Assert
      expect(progresso).toBeCloseTo(20, 0); // Aproximadamente 20%
    });
  });

  describe('Cálculo de Média', () => {
    it('deve calcular média de cargas corretamente', () => {
      // Arrange
      const cargas = [80, 85, 90, 95, 100];

      // Act
      const media = Analise.calcularMedia(cargas);

      // Assert
      expect(media).toBe(90); // (80+85+90+95+100)/5 = 90
    });

    it('deve retornar 0 para array vazio', () => {
      // Arrange
      const cargas: number[] = [];

      // Act
      const media = Analise.calcularMedia(cargas);

      // Assert
      expect(media).toBe(0);
    });

    it('deve calcular média de uma única carga', () => {
      // Arrange
      const cargas = [75];

      // Act
      const media = Analise.calcularMedia(cargas);

      // Assert
      expect(media).toBe(75);
    });

    it('deve calcular média com valores decimais', () => {
      // Arrange
      const cargas = [50.5, 60.5, 70.5];

      // Act
      const media = Analise.calcularMedia(cargas);

      // Assert
      expect(media).toBeCloseTo(60.5, 1);
    });

    it('deve lidar com valores grandes', () => {
      // Arrange
      const cargas = [200, 250, 300, 350, 400];

      // Act
      const media = Analise.calcularMedia(cargas);

      // Assert
      expect(media).toBe(300);
    });
  });

  describe('Validação de Período', () => {
    it('deve ter período de início anterior ao fim', () => {
      // Arrange
      const analise = new Analise();
      analise.periodoInicio = new Date('2026-01-01');
      analise.periodoFim = new Date('2026-02-18');

      // Assert
      expect(analise.periodoInicio.getTime()).toBeLessThan(
        analise.periodoFim.getTime(),
      );
    });

    it('deve permitir mesmo dia para início e fim', () => {
      // Arrange
      const analise = new Analise();
      const hoje = new Date('2026-02-18');
      analise.periodoInicio = hoje;
      analise.periodoFim = hoje;

      // Assert
      expect(analise.periodoInicio.getTime()).toBe(
        analise.periodoFim.getTime(),
      );
    });
  });

  describe('Agregação de Métricas', () => {
    it('deve armazenar carga máxima do período', () => {
      // Arrange
      const analise = new Analise();
      analise.cargaMaxima = 120;

      // Assert
      expect(analise.cargaMaxima).toBe(120);
      expect(analise.cargaMaxima).toBeGreaterThan(0);
    });

    it('deve armazenar total de treinos', () => {
      // Arrange
      const analise = new Analise();
      analise.totalTreinos = 25;

      // Assert
      expect(analise.totalTreinos).toBe(25);
      expect(Number.isInteger(analise.totalTreinos)).toBe(true);
    });

    it('deve ter progresso como opcional', () => {
      // Arrange
      const analise = new Analise();

      // Assert
      expect(analise.progresso).toBeUndefined();
    });
  });

  describe('Relacionamento com Usuario', () => {
    it('deve ter referência para usuarioId', () => {
      // Arrange
      const analise = new Analise();
      const usuarioId = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      analise.usuarioId = usuarioId;

      // Assert
      expect(analise.usuarioId).toBe(usuarioId);
    });

    it('deve permitir associação com entidade Usuario', () => {
      // Arrange
      const usuario = new Usuario();
      usuario.id = '123e4567-e89b-12d3-a456-426614174000';
      usuario.nome = 'Maria Santos';

      const analise = new Analise();

      // Act
      analise.usuario = usuario;
      analise.usuarioId = usuario.id;

      // Assert
      expect(analise.usuario).toBeDefined();
      expect(analise.usuario.id).toBe(usuario.id);
      expect(analise.usuarioId).toBe(usuario.id);
    });
  });

  describe('Análise Completa', () => {
    it('deve criar análise completa com todas as métricas', () => {
      // Arrange
      const cargas = [80, 85, 90, 95, 100];
      const analise = new Analise();

      // Act
      analise.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
      analise.exercicioNome = 'Agachamento';
      analise.periodoInicio = new Date('2026-01-01');
      analise.periodoFim = new Date('2026-02-18');
      analise.cargaMaxima = Math.max(...cargas);
      analise.cargaMedia = Analise.calcularMedia(cargas);
      analise.totalTreinos = cargas.length;
      analise.progresso = Analise.calcularProgresso(
        cargas[0],
        cargas[cargas.length - 1],
      );

      // Assert
      expect(analise.cargaMaxima).toBe(100);
      expect(analise.cargaMedia).toBe(90);
      expect(analise.totalTreinos).toBe(5);
      expect(analise.progresso).toBe(25); // (100-80)/80 * 100
    });
  });
});
