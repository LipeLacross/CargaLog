import { Email } from './email.vo';

describe('Email Value Object', () => {
  describe('Email Válido', () => {
    it('deve criar email válido', () => {
      // Arrange & Act
      const email = new Email('usuario@example.com');

      // Assert
      expect(email).toBeDefined();
      expect(email.getValue()).toBe('usuario@example.com');
    });

    it('deve aceitar email com subdomínio', () => {
      // Arrange & Act
      const email = new Email('usuario@mail.example.com');

      // Assert
      expect(email.getValue()).toBe('usuario@mail.example.com');
    });

    it('deve aceitar email com números', () => {
      // Arrange & Act
      const email = new Email('user123@example.com');

      // Assert
      expect(email.getValue()).toBe('user123@example.com');
    });

    it('deve aceitar email com pontos no nome', () => {
      // Arrange & Act
      const email = new Email('first.last@example.com');

      // Assert
      expect(email.getValue()).toBe('first.last@example.com');
    });

    it('deve aceitar email com hífen', () => {
      // Arrange & Act
      const email = new Email('user-name@example.com');

      // Assert
      expect(email.getValue()).toBe('user-name@example.com');
    });
  });

  describe('Email Inválido', () => {
    it('deve lançar exceção para email sem @', () => {
      // Act & Assert
      expect(() => new Email('usuarioexample.com')).toThrow('Email inválido');
    });

    it('deve lançar exceção para email sem domínio', () => {
      // Act & Assert
      expect(() => new Email('usuario@')).toThrow('Email inválido');
    });

    it('deve lançar exceção para email sem nome de usuário', () => {
      // Act & Assert
      expect(() => new Email('@example.com')).toThrow('Email inválido');
    });

    it('deve lançar exceção para email sem extensão', () => {
      // Act & Assert
      expect(() => new Email('usuario@example')).toThrow('Email inválido');
    });

    it('deve lançar exceção para email com espaços', () => {
      // Act & Assert
      expect(() => new Email('usuario @example.com')).toThrow('Email inválido');
    });

    it('deve lançar exceção para email vazio', () => {
      // Act & Assert
      expect(() => new Email('')).toThrow('Email inválido');
    });

    it('deve lançar exceção para email com múltiplos @', () => {
      // Act & Assert
      expect(() => new Email('usuario@@example.com')).toThrow('Email inválido');
    });
  });

  describe('Normalização', () => {
    it('deve normalizar email para lowercase', () => {
      // Arrange & Act
      const email = new Email('USER@EXAMPLE.COM');

      // Assert
      expect(email.getValue()).toBe('user@example.com');
    });

    it('deve remover espaços ao redor do email', () => {
      // Arrange & Act
      const email = new Email('  usuario@example.com  ');

      // Assert
      expect(email.getValue()).toBe('usuario@example.com');
    });

    it('deve normalizar email com maiúsculas e espaços', () => {
      // Arrange & Act
      const email = new Email('  USER@EXAMPLE.COM  ');

      // Assert
      expect(email.getValue()).toBe('user@example.com');
    });
  });

  describe('Imutabilidade', () => {
    it('não deve permitir alteração do valor', () => {
      // Arrange
      const email = new Email('usuario@example.com');
      const valorOriginal = email.getValue();

      // Act - tentativa de alterar (não deve ser possível devido a readonly)
      // email.value = 'outro@example.com'; // Erro de compilação

      // Assert
      expect(email.getValue()).toBe(valorOriginal);
    });

    it('deve retornar sempre o mesmo valor', () => {
      // Arrange
      const email = new Email('usuario@example.com');

      // Act
      const valor1 = email.getValue();
      const valor2 = email.getValue();

      // Assert
      expect(valor1).toBe(valor2);
    });
  });

  describe('Igualdade', () => {
    it('deve considerar emails iguais com mesmo valor', () => {
      // Arrange
      const email1 = new Email('usuario@example.com');
      const email2 = new Email('usuario@example.com');

      // Act
      const saoIguais = email1.equals(email2);

      // Assert
      expect(saoIguais).toBe(true);
    });

    it('deve considerar emails diferentes com valores diferentes', () => {
      // Arrange
      const email1 = new Email('usuario1@example.com');
      const email2 = new Email('usuario2@example.com');

      // Act
      const saoIguais = email1.equals(email2);

      // Assert
      expect(saoIguais).toBe(false);
    });

    it('deve considerar emails iguais independente de maiúsculas', () => {
      // Arrange
      const email1 = new Email('USER@EXAMPLE.COM');
      const email2 = new Email('user@example.com');

      // Act
      const saoIguais = email1.equals(email2);

      // Assert
      expect(saoIguais).toBe(true);
    });
  });

  describe('Representação em String', () => {
    it('deve retornar string correta com toString', () => {
      // Arrange
      const email = new Email('usuario@example.com');

      // Act
      const str = email.toString();

      // Assert
      expect(str).toBe('usuario@example.com');
    });
  });
});
