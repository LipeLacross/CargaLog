import { Carga } from './carga.vo';

describe('Carga Value Object', () => {
  describe('Carga Positiva', () => {
    it('deve criar carga válida em kg', () => {
      // Arrange & Act
      const carga = new Carga(100, 'kg');

      // Assert
      expect(carga).toBeDefined();
      expect(carga.getValor()).toBe(100);
      expect(carga.getUnidade()).toBe('kg');
    });

    it('deve criar carga válida em lb', () => {
      // Arrange & Act
      const carga = new Carga(220, 'lb');

      // Assert
      expect(carga.getValor()).toBe(220);
      expect(carga.getUnidade()).toBe('lb');
    });

    it('deve usar kg como unidade padrão', () => {
      // Arrange & Act
      const carga = new Carga(50);

      // Assert
      expect(carga.getUnidade()).toBe('kg');
    });

    it('deve aceitar valores decimais', () => {
      // Arrange & Act
      const carga = new Carga(52.5, 'kg');

      // Assert
      expect(carga.getValor()).toBe(52.5);
    });

    it('deve aceitar valores muito pequenos', () => {
      // Arrange & Act
      const carga = new Carga(0.5, 'kg');

      // Assert
      expect(carga.getValor()).toBe(0.5);
    });
  });

  describe('Carga Inválida', () => {
    it('deve lançar exceção para carga zero', () => {
      // Act & Assert
      expect(() => new Carga(0)).toThrow('Carga deve ser um valor positivo');
    });

    it('deve lançar exceção para carga negativa', () => {
      // Act & Assert
      expect(() => new Carga(-10)).toThrow('Carga deve ser um valor positivo');
    });

    it('deve lançar exceção para carga muito alta', () => {
      // Act & Assert
      expect(() => new Carga(10001)).toThrow(
        'Carga deve ser um valor positivo',
      );
    });
  });

  describe('Conversão de Unidades', () => {
    it('deve converter kg para lb corretamente', () => {
      // Arrange
      const carga = new Carga(100, 'kg');

      // Act
      const emLb = carga.toLb();

      // Assert
      expect(emLb).toBeCloseTo(220.462, 2); // 100 kg ≈ 220.462 lb
    });

    it('deve converter lb para kg corretamente', () => {
      // Arrange
      const carga = new Carga(220, 'lb');

      // Act
      const emKg = carga.toKg();

      // Assert
      expect(emKg).toBeCloseTo(99.79, 2); // 220 lb ≈ 99.79 kg
    });

    it('deve retornar mesmo valor ao converter kg para kg', () => {
      // Arrange
      const carga = new Carga(100, 'kg');

      // Act
      const emKg = carga.toKg();

      // Assert
      expect(emKg).toBe(100);
    });

    it('deve retornar mesmo valor ao converter lb para lb', () => {
      // Arrange
      const carga = new Carga(220, 'lb');

      // Act
      const emLb = carga.toLb();

      // Assert
      expect(emLb).toBe(220);
    });

    it('deve converter valores decimais corretamente', () => {
      // Arrange
      const carga = new Carga(52.5, 'kg');

      // Act
      const emLb = carga.toLb();

      // Assert
      expect(emLb).toBeCloseTo(115.74, 2); // 52.5 kg ≈ 115.74 lb
    });
  });

  describe('Igualdade', () => {
    it('deve considerar cargas iguais com mesmo valor e unidade', () => {
      // Arrange
      const carga1 = new Carga(100, 'kg');
      const carga2 = new Carga(100, 'kg');

      // Act
      const saoIguais = carga1.equals(carga2);

      // Assert
      expect(saoIguais).toBe(true);
    });

    it('deve considerar cargas equivalentes em unidades diferentes', () => {
      // Arrange
      const carga1 = new Carga(100, 'kg');
      const carga2 = new Carga(220.462, 'lb'); // 100 kg em lb

      // Act
      const saoIguais = carga1.equals(carga2);

      // Assert
      expect(saoIguais).toBe(true);
    });

    it('deve considerar cargas diferentes com valores diferentes', () => {
      // Arrange
      const carga1 = new Carga(100, 'kg');
      const carga2 = new Carga(150, 'kg');

      // Act
      const saoIguais = carga1.equals(carga2);

      // Assert
      expect(saoIguais).toBe(false);
    });
  });

  describe('Imutabilidade', () => {
    it('não deve permitir alteração do valor', () => {
      // Arrange
      const carga = new Carga(100, 'kg');
      const valorOriginal = carga.getValor();

      // Act - tentativa de alterar (não deve ser possível devido a readonly)
      // carga.valor = 200; // Erro de compilação

      // Assert
      expect(carga.getValor()).toBe(valorOriginal);
    });

    it('não deve permitir alteração da unidade', () => {
      // Arrange
      const carga = new Carga(100, 'kg');
      const unidadeOriginal = carga.getUnidade();

      // Act - tentativa de alterar (não deve ser possível devido a readonly)
      // carga.unidade = 'lb'; // Erro de compilação

      // Assert
      expect(carga.getUnidade()).toBe(unidadeOriginal);
    });
  });

  describe('Representação em String', () => {
    it('deve retornar string formatada para kg', () => {
      // Arrange
      const carga = new Carga(100, 'kg');

      // Act
      const str = carga.toString();

      // Assert
      expect(str).toBe('100 kg');
    });

    it('deve retornar string formatada para lb', () => {
      // Arrange
      const carga = new Carga(220, 'lb');

      // Act
      const str = carga.toString();

      // Assert
      expect(str).toBe('220 lb');
    });

    it('deve formatar valores decimais', () => {
      // Arrange
      const carga = new Carga(52.5, 'kg');

      // Act
      const str = carga.toString();

      // Assert
      expect(str).toBe('52.5 kg');
    });
  });

  describe('Casos Extremos', () => {
    it('deve aceitar carga mínima válida', () => {
      // Arrange & Act
      const carga = new Carga(0.1, 'kg');

      // Assert
      expect(carga.getValor()).toBe(0.1);
    });

    it('deve aceitar carga próxima ao limite máximo', () => {
      // Arrange & Act
      const carga = new Carga(9999, 'kg');

      // Assert
      expect(carga.getValor()).toBe(9999);
    });
  });
});
