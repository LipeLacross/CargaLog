import { vi, describe, it, expect, beforeEach } from 'vitest';
import { RegistrarUsuarioUseCase } from './registrar-usuario.use-case';
import { IUsuarioRepository } from '../../../domain/repositories/usuario.repository.interface';
import { RegistrarUsuarioDto } from '../../dto/auth/registrar-usuario.dto';
import { ConflictException } from '@nestjs/common';
import { LoggerService } from '../../../shared/services/logger.service';

describe('RegistrarUsuarioUseCase', () => {
  let useCase: RegistrarUsuarioUseCase;
  let repository: ReturnType<typeof vi.fn>;

  const mockRepositorio = {
    criar: vi.fn(),
    buscarPorId: vi.fn(),
    buscarPorEmail: vi.fn(),
    existeEmail: vi.fn(),
    atualizar: vi.fn(),
    deletar: vi.fn(),
    listar: vi.fn(),
  };

  const mockLogger = {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    verbose: vi.fn(),
    audit: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    repository = mockRepositorio;
    useCase = new RegistrarUsuarioUseCase(
      mockRepositorio as unknown as IUsuarioRepository,
      mockLogger as unknown as LoggerService,
    );
  });

  describe('Caminho Feliz', () => {
    it('deve registrar usuário com sucesso', async () => {
      // Arrange
      const dto: RegistrarUsuarioDto = {
        nome: 'João Silva',
        email: 'joao@example.com',
        senha: 'Senha@123',
      };

      const usuarioCriado = {
        id: '123',
        nome: dto.nome,
        email: dto.email,
        senha: 'hash-bcrypt',
        treinos: [],
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };

      repository.existeEmail.mockResolvedValue(false);
      repository.criar.mockResolvedValue(usuarioCriado);

      // Act
      const resultado = await useCase.execute(dto);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado.id).toBe('123');
      expect(resultado.nome).toBe(dto.nome);
      expect(resultado.email).toBe(dto.email);
      expect(resultado).not.toHaveProperty('senha');
      expect(repository.existeEmail).toHaveBeenCalledWith('joao@example.com');
      expect(repository.criar).toHaveBeenCalled();
    });

    it('deve normalizar email para lowercase', async () => {
      // Arrange
      const dto: RegistrarUsuarioDto = {
        nome: 'João Silva',
        email: 'JOAO@EXAMPLE.COM',
        senha: 'Senha@123',
      };

      repository.existeEmail.mockResolvedValue(false);
      repository.criar.mockResolvedValue({
        id: '123',
        nome: dto.nome,
        email: 'joao@example.com',
        senha: 'hash-bcrypt',
        treinos: [],
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      });

      // Act
      await useCase.execute(dto);

      // Assert
      expect(repository.existeEmail).toHaveBeenCalledWith('joao@example.com');
    });
  });

  describe('Casos de Exceção', () => {
    it('deve lançar exceção se email já existe', async () => {
      // Arrange
      const dto: RegistrarUsuarioDto = {
        nome: 'João Silva',
        email: 'joao@example.com',
        senha: 'Senha@123',
      };

      repository.existeEmail.mockResolvedValue(true);

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(ConflictException);
      expect(repository.criar).not.toHaveBeenCalled();
    });

    it('deve lançar erro se email for inválido', async () => {
      // Arrange
      const dto = {
        nome: 'João Silva',
        email: 'email-invalido',
        senha: 'Senha@123',
      };

      // Act & Assert
      await expect(useCase.execute(dto as any)).rejects.toThrow();
    });
  });

  describe('Validações', () => {
    it('deve validar email com Value Object', async () => {
      // Arrange
      const dto: RegistrarUsuarioDto = {
        nome: 'João Silva',
        email: 'joao@example.com',
        senha: 'Senha@123',
      };

      repository.existeEmail.mockResolvedValue(false);
      repository.criar.mockResolvedValue({
        id: '123',
        nome: dto.nome,
        email: dto.email,
        senha: 'hash',
        treinos: [],
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      });

      // Act
      await useCase.execute(dto);

      // Assert - email válido foi usado
      expect(repository.existeEmail).toHaveBeenCalledWith(
        expect.stringMatching(/@example\.com$/),
      );
    });

    it('não deve retornar senha do usuário', async () => {
      // Arrange
      const dto: RegistrarUsuarioDto = {
        nome: 'João Silva',
        email: 'joao@example.com',
        senha: 'Senha@123',
      };

      const usuarioCriado = {
        id: '123',
        nome: dto.nome,
        email: dto.email,
        senha: 'hash-bcrypt-muito-seguro',
        treinos: [],
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };

      repository.existeEmail.mockResolvedValue(false);
      repository.criar.mockResolvedValue(usuarioCriado);

      // Act
      const resultado = await useCase.execute(dto);

      // Assert
      expect(resultado).not.toHaveProperty('senha');
    });
  });
});
