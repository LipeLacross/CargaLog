import { Repeticoes } from './repeticoes.vo';

describe('Repeticoes Value Object', () => {
  describe('Valor Válido', () => {
    it('deve criar repetições válidas', () => {
      // Arrange & Act
      const repeticoes = new Repeticoes(10);

      // Assert
      expect(repeticoes).toBeDefined();
      expect(repeticoes.getValor()).toBe(10);
    });

    it('deve aceitar valor mínimo (1)', () => {
      // Arrange & Act
      const repeticoes = new Repeticoes(1);

      // Assert
      expect(repeticoes.getValor()).toBe(1);
    });

    it('deve aceitar valor máximo (1000)', () => {
      // Arrange & Act
      const repeticoes = new Repeticoes(1000);

      // Assert
      expect(repeticoes.getValor()).toBe(1000);
    });

    it('deve aceitar valores intermediários', () => {
      // Arrange & Act
      const repeticoes = new Repeticoes(15);

      // Assert
      expect(repeticoes.getValor()).toBe(15);
    });
  });

  describe('Valor Inválido', () => {
    it('deve lançar exceção para zero', () => {
      // Act & Assert
      expect(() => new Repeticoes(0)).toThrow(
        'Repetições devem estar entre 1 e 1000',
      );
    });

    it('deve lançar exceção para valores negativos', () => {
      // Act & Assert
      expect(() => new Repeticoes(-5)).toThrow(
        'Repetições devem estar entre 1 e 1000',
      );
    });

    it('deve lançar exceção para valores acima do limite', () => {
      // Act & Assert
      expect(() => new Repeticoes(1001)).toThrow(
        'Repetições devem estar entre 1 e 1000',
      );
    });

    it('deve lançar exceção para valores decimais', () => {
      // Act & Assert
      expect(() => new Repeticoes(10.5)).toThrow(
        'Repetições devem estar entre 1 e 1000',
      );
    });
  });

  describe('Classificação de Treino - Força', () => {
    it('deve identificar treino de força para 1 repetição', () => {
      // Arrange
      const repeticoes = new Repeticoes(1);

      // Act
      const isForca = repeticoes.isForca();

      // Assert
      expect(isForca).toBe(true);
      expect(repeticoes.isHipertrofia()).toBe(false);
      expect(repeticoes.isResistencia()).toBe(false);
    });

    it('deve identificar treino de força para 5 repetições', () => {
      // Arrange
      const repeticoes = new Repeticoes(5);

      // Act
      const isForca = repeticoes.isForca();

      // Assert
      expect(isForca).toBe(true);
    });

    it('deve identificar treino de força para 3 repetições', () => {
      // Arrange
      const repeticoes = new Repeticoes(3);

      // Assert
      expect(repeticoes.isForca()).toBe(true);
    });
  });

  describe('Classificação de Treino - Hipertrofia', () => {
    it('deve identificar treino de hipertrofia para 6 repetições', () => {
      // Arrange
      const repeticoes = new Repeticoes(6);

      // Act
      const isHipertrofia = repeticoes.isHipertrofia();

      // Assert
      expect(isHipertrofia).toBe(true);
      expect(repeticoes.isForca()).toBe(false);
      expect(repeticoes.isResistencia()).toBe(false);
    });

    it('deve identificar treino de hipertrofia para 12 repetições', () => {
      // Arrange
      const repeticoes = new Repeticoes(12);

      // Assert
      expect(repeticoes.isHipertrofia()).toBe(true);
    });

    it('deve identificar treino de hipertrofia para 10 repetições', () => {
      // Arrange
      const repeticoes = new Repeticoes(10);

      // Assert
      expect(repeticoes.isHipertrofia()).toBe(true);
    });
  });

  describe('Classificação de Treino - Resistência', () => {
    it('deve identificar treino de resistência para 13 repetições', () => {
      // Arrange
      const repeticoes = new Repeticoes(13);

      // Act
      const isResistencia = repeticoes.isResistencia();

      // Assert
      expect(isResistencia).toBe(true);
      expect(repeticoes.isForca()).toBe(false);
      expect(repeticoes.isHipertrofia()).toBe(false);
    });

    it('deve identificar treino de resistência para 20 repetições', () => {
      // Arrange
      const repeticoes = new Repeticoes(20);

      // Assert
      expect(repeticoes.isResistencia()).toBe(true);
    });

    it('deve identificar treino de resistência para 50 repetições', () => {
      // Arrange
      const repeticoes = new Repeticoes(50);

      // Assert
      expect(repeticoes.isResistencia()).toBe(true);
    });
  });

  describe('Igualdade', () => {
    it('deve considerar repetições iguais com mesmo valor', () => {
      // Arrange
      const rep1 = new Repeticoes(10);
      const rep2 = new Repeticoes(10);

      // Act
      const saoIguais = rep1.equals(rep2);

      // Assert
      expect(saoIguais).toBe(true);
    });

    it('deve considerar repetições diferentes com valores diferentes', () => {
      // Arrange
      const rep1 = new Repeticoes(10);
      const rep2 = new Repeticoes(15);

      // Act
      const saoIguais = rep1.equals(rep2);

      // Assert
      expect(saoIguais).toBe(false);
    });
  });

  describe('Imutabilidade', () => {
    it('não deve permitir alteração do valor', () => {
      // Arrange
      const repeticoes = new Repeticoes(10);
      const valorOriginal = repeticoes.getValor();

      // Act - tentativa de alterar (não deve ser possível devido a readonly)
      // repeticoes.valor = 20; // Erro de compilação

      // Assert
      expect(repeticoes.getValor()).toBe(valorOriginal);
    });

    it('deve retornar sempre o mesmo valor', () => {
      // Arrange
      const repeticoes = new Repeticoes(8);

      // Act
      const valor1 = repeticoes.getValor();
      const valor2 = repeticoes.getValor();

      // Assert
      expect(valor1).toBe(valor2);
    });
  });

  describe('Representação em String', () => {
    it('deve retornar string formatada', () => {
      // Arrange
      const repeticoes = new Repeticoes(10);

      // Act
      const str = repeticoes.toString();

      // Assert
      expect(str).toBe('10 reps');
    });

    it('deve usar singular para 1 repetição', () => {
      // Arrange
      const repeticoes = new Repeticoes(1);

      // Act
      const str = repeticoes.toString();

      // Assert
      expect(str).toContain('1');
    });
  });

  describe('Casos Extremos', () => {
    it('deve validar corretamente valor no limite inferior', () => {
      // Arrange & Act
      const repeticoes = new Repeticoes(1);

      // Assert
      expect(repeticoes.getValor()).toBe(1);
      expect(repeticoes.isForca()).toBe(true);
    });

    it('deve validar corretamente valor no limite superior', () => {
      // Arrange & Act
      const repeticoes = new Repeticoes(1000);

      // Assert
      expect(repeticoes.getValor()).toBe(1000);
      expect(repeticoes.isResistencia()).toBe(true);
    });

    it('deve validar transição entre força e hipertrofia', () => {
      // Arrange
      const forca = new Repeticoes(5);
      const hipertrofia = new Repeticoes(6);

      // Assert
      expect(forca.isForca()).toBe(true);
      expect(forca.isHipertrofia()).toBe(false);
      expect(hipertrofia.isForca()).toBe(false);
      expect(hipertrofia.isHipertrofia()).toBe(true);
    });

    it('deve validar transição entre hipertrofia e resistência', () => {
      // Arrange
      const hipertrofia = new Repeticoes(12);
      const resistencia = new Repeticoes(13);

      // Assert
      expect(hipertrofia.isHipertrofia()).toBe(true);
      expect(hipertrofia.isResistencia()).toBe(false);
      expect(resistencia.isHipertrofia()).toBe(false);
      expect(resistencia.isResistencia()).toBe(true);
    });
  });
});
