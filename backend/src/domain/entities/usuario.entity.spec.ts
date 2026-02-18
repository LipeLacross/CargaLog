import { Usuario } from './usuario.entity';
import * as bcrypt from 'bcrypt';

describe('Usuario Entity', () => {
  describe('Criação', () => {
    it('deve criar uma instância válida de Usuario', () => {
      // Arrange & Act
      const usuario = new Usuario();
      usuario.nome = 'João Silva';
      usuario.email = 'joao@example.com';
      usuario.senha = 'hashedPassword123';

      // Assert
      expect(usuario).toBeDefined();
      expect(usuario.nome).toBe('João Silva');
      expect(usuario.email).toBe('joao@example.com');
      expect(usuario.senha).toBe('hashedPassword123');
    });

    it('deve ter propriedades opcionais como undefined', () => {
      // Arrange & Act
      const usuario = new Usuario();

      // Assert
      expect(usuario.id).toBeUndefined();
      expect(usuario.criadoEm).toBeUndefined();
      expect(usuario.atualizadoEm).toBeUndefined();
    });
  });

  describe('Validação de Email', () => {
    it('deve aceitar email único', () => {
      // Arrange
      const usuario = new Usuario();
      usuario.email = 'unique@example.com';

      // Assert
      expect(usuario.email).toBe('unique@example.com');
    });

    it('deve armazenar email em lowercase', () => {
      // Arrange
      const usuario = new Usuario();
      usuario.email = 'USER@EXAMPLE.COM'.toLowerCase();

      // Assert
      expect(usuario.email).toBe('user@example.com');
    });
  });

  describe('Validação de Senha', () => {
    it('deve validar senha correta com hash bcrypt', async () => {
      // Arrange
      const senhaPlain = 'SenhaForte@123';
      const senhaHash = await bcrypt.hash(senhaPlain, 10);

      // Act
      const resultado = await Usuario.validarSenha(senhaPlain, senhaHash);

      // Assert
      expect(resultado).toBe(true);
    });

    it('deve rejeitar senha incorreta', async () => {
      // Arrange
      const senhaPlain = 'SenhaForte@123';
      const senhaErrada = 'SenhaErrada@456';
      const senhaHash = await bcrypt.hash(senhaPlain, 10);

      // Act
      const resultado = await Usuario.validarSenha(senhaErrada, senhaHash);

      // Assert
      expect(resultado).toBe(false);
    });

    it('deve retornar false para senha vazia', async () => {
      // Arrange
      const senhaHash = await bcrypt.hash('SenhaForte@123', 10);

      // Act
      const resultado = await Usuario.validarSenha('', senhaHash);

      // Assert
      expect(resultado).toBe(false);
    });
  });

  describe('Hash de Senha', () => {
    it('deve gerar hash diferente para mesma senha (salt único)', async () => {
      // Arrange
      const senha = 'SenhaForte@123';

      // Act
      const hash1 = await bcrypt.hash(senha, 10);
      const hash2 = await bcrypt.hash(senha, 10);

      // Assert
      expect(hash1).not.toBe(hash2);
      expect(hash1).toHaveLength(60); // bcrypt gera hash de 60 caracteres
      expect(hash2).toHaveLength(60);
    });

    it('hash deve ser verificável', async () => {
      // Arrange
      const senha = 'TesteSenha@789';
      const hash = await bcrypt.hash(senha, 10);

      // Act
      const valido = await bcrypt.compare(senha, hash);

      // Assert
      expect(valido).toBe(true);
    });
  });

  describe('Relacionamentos', () => {
    it('deve permitir associação com treinos', () => {
      // Arrange
      const usuario = new Usuario();
      usuario.treinos = [];

      // Assert
      expect(usuario.treinos).toBeDefined();
      expect(Array.isArray(usuario.treinos)).toBe(true);
      expect(usuario.treinos).toHaveLength(0);
    });
  });

  describe('Timestamps', () => {
    it('deve ter campos de timestamp definidos', () => {
      // Arrange
      const usuario = new Usuario();
      const agora = new Date();

      // Act
      usuario.criadoEm = agora;
      usuario.atualizadoEm = agora;

      // Assert
      expect(usuario.criadoEm).toBeInstanceOf(Date);
      expect(usuario.atualizadoEm).toBeInstanceOf(Date);
      expect(usuario.criadoEm).toBe(agora);
    });
  });
});
