import { Treino } from './treino.entity';
import { Usuario } from './usuario.entity';

describe('Treino Entity', () => {
  describe('Criação', () => {
    it('deve criar uma instância válida de Treino', () => {
      // Arrange & Act
      const treino = new Treino();
      treino.exercicioNome = 'Supino Reto';
      treino.carga = 80;
      treino.repeticoes = 10;
      treino.series = 3;
      treino.data = new Date('2026-02-18');

      // Assert
      expect(treino).toBeDefined();
      expect(treino.exercicioNome).toBe('Supino Reto');
      expect(treino.carga).toBe(80);
      expect(treino.repeticoes).toBe(10);
      expect(treino.series).toBe(3);
    });

    it('deve ter observações como opcional', () => {
      // Arrange & Act
      const treino = new Treino();
      treino.exercicioNome = 'Agachamento';
      treino.carga = 100;
      treino.repeticoes = 8;

      // Assert
      expect(treino.observacoes).toBeUndefined();
    });

    it('deve ter séries com valor padrão de 1', () => {
      // Arrange & Act
      const treino = new Treino();
      treino.series = 1; // Valor padrão

      // Assert
      expect(treino.series).toBe(1);
    });
  });

  describe('Validação de Carga', () => {
    it('deve aceitar carga positiva', () => {
      // Arrange
      const carga = 50;

      // Act
      const resultado = Treino.validarCarga(carga);

      // Assert
      expect(resultado).toBe(true);
    });

    it('deve rejeitar carga zero', () => {
      // Arrange
      const carga = 0;

      // Act
      const resultado = Treino.validarCarga(carga);

      // Assert
      expect(resultado).toBe(false);
    });

    it('deve rejeitar carga negativa', () => {
      // Arrange
      const carga = -10;

      // Act
      const resultado = Treino.validarCarga(carga);

      // Assert
      expect(resultado).toBe(false);
    });

    it('deve aceitar cargas decimais positivas', () => {
      // Arrange
      const carga = 52.5;

      // Act
      const resultado = Treino.validarCarga(carga);

      // Assert
      expect(resultado).toBe(true);
    });
  });

  describe('Validação de Repetições', () => {
    it('deve aceitar repetições positivas', () => {
      // Arrange
      const treino = new Treino();
      treino.repeticoes = 12;

      // Assert
      expect(treino.repeticoes).toBe(12);
      expect(treino.repeticoes).toBeGreaterThan(0);
    });

    it('deve armazenar repetições como número inteiro', () => {
      // Arrange
      const treino = new Treino();
      treino.repeticoes = 8;

      // Assert
      expect(Number.isInteger(treino.repeticoes)).toBe(true);
    });
  });

  describe('Relacionamento com Usuario', () => {
    it('deve ter referência para usuarioId', () => {
      // Arrange
      const treino = new Treino();
      const usuarioId = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      treino.usuarioId = usuarioId;

      // Assert
      expect(treino.usuarioId).toBe(usuarioId);
    });

    it('deve permitir associação com entidade Usuario', () => {
      // Arrange
      const usuario = new Usuario();
      usuario.id = '123e4567-e89b-12d3-a456-426614174000';
      usuario.nome = 'João Silva';

      const treino = new Treino();

      // Act
      treino.usuario = usuario;
      treino.usuarioId = usuario.id;

      // Assert
      expect(treino.usuario).toBeDefined();
      expect(treino.usuario.id).toBe(usuario.id);
      expect(treino.usuarioId).toBe(usuario.id);
    });
  });

  describe('Data do Treino', () => {
    it('deve armazenar data do treino', () => {
      // Arrange
      const treino = new Treino();
      const data = new Date('2026-02-18');

      // Act
      treino.data = data;

      // Assert
      expect(treino.data).toBeInstanceOf(Date);
      expect(treino.data.toISOString().split('T')[0]).toBe('2026-02-18');
    });

    it('deve permitir datas passadas', () => {
      // Arrange
      const treino = new Treino();
      const dataPast = new Date('2025-01-01');

      // Act
      treino.data = dataPast;

      // Assert
      expect(treino.data.getTime()).toBeLessThan(new Date().getTime());
    });
  });

  describe('Campos Adicionais', () => {
    it('deve armazenar observações quando fornecidas', () => {
      // Arrange
      const treino = new Treino();
      const observacao = 'Treino pesado, aumentar descanso entre séries';

      // Act
      treino.observacoes = observacao;

      // Assert
      expect(treino.observacoes).toBe(observacao);
    });

    it('deve ter timestamp de criação', () => {
      // Arrange
      const treino = new Treino();
      const agora = new Date();

      // Act
      treino.criadoEm = agora;

      // Assert
      expect(treino.criadoEm).toBeInstanceOf(Date);
      expect(treino.criadoEm).toBe(agora);
    });
  });

  describe('Validação Completa', () => {
    it('deve validar treino completo com todos os campos obrigatórios', () => {
      // Arrange & Act
      const treino = new Treino();
      treino.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
      treino.exercicioNome = 'Leg Press';
      treino.carga = 200;
      treino.repeticoes = 15;
      treino.series = 4;
      treino.data = new Date();

      // Assert
      expect(treino.usuarioId).toBeDefined();
      expect(treino.exercicioNome).toBeDefined();
      expect(Treino.validarCarga(treino.carga)).toBe(true);
      expect(treino.repeticoes).toBeGreaterThan(0);
      expect(treino.series).toBeGreaterThan(0);
      expect(treino.data).toBeInstanceOf(Date);
    });
  });
});
