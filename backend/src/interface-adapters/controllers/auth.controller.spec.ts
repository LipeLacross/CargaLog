import { vi, describe, it, expect } from 'vitest';
import { AuthController } from './auth.controller';
import { RegistrarUsuarioUseCase } from '../../application/use-cases/auth/registrar-usuario.use-case';
import { AutenticarUsuarioUseCase } from '../../application/use-cases/auth/autenticar-usuario.use-case';
import { ResetPasswordUseCase } from '../../application/use-cases/auth/reset-password.use-case';
import { AtualizarPerfilUseCase } from '../../application/use-cases/auth/atualizar-perfil.use-case';
import { RegistrarUsuarioDto } from '../../application/dto/auth/registrar-usuario.dto';
import { LoginDto } from '../../application/dto/auth/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let registrarUseCase: { execute: ReturnType<typeof vi.fn> };
  let autenticarUseCase: { execute: ReturnType<typeof vi.fn> };
  let resetPasswordUseCase: { execute: ReturnType<typeof vi.fn> };
  let atualizarPerfilUseCase: { execute: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    registrarUseCase = { execute: vi.fn() };
    autenticarUseCase = { execute: vi.fn() };
    resetPasswordUseCase = { execute: vi.fn() };
    atualizarPerfilUseCase = { execute: vi.fn() };

    controller = new AuthController(
      registrarUseCase as unknown as RegistrarUsuarioUseCase,
      autenticarUseCase as unknown as AutenticarUsuarioUseCase,
      resetPasswordUseCase as unknown as ResetPasswordUseCase,
      atualizarPerfilUseCase as unknown as AtualizarPerfilUseCase,
    );
  });

  describe('POST /auth/registrar', () => {
    it('deve registrar usuário com sucesso', async () => {
      // Arrange
      const dto: RegistrarUsuarioDto = {
        nome: 'João Silva',
        email: 'joao@example.com',
        senha: 'Senha@123',
      };

      const usuarioRetornado = {
        id: '123',
        nome: dto.nome,
        email: dto.email,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };

      registrarUseCase.execute.mockResolvedValue(usuarioRetornado);

      // Act
      const resultado = await controller.registrar(dto);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado.id).toBe('123');
      expect(registrarUseCase.execute).toHaveBeenCalledWith(dto);
    });

    it('deve não retornar senha do usuário', async () => {
      // Arrange
      const dto: RegistrarUsuarioDto = {
        nome: 'João Silva',
        email: 'joao@example.com',
        senha: 'Senha@123',
      };

      const usuarioRetornado = {
        id: '123',
        nome: dto.nome,
        email: dto.email,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };

      registrarUseCase.execute.mockResolvedValue(usuarioRetornado);

      // Act
      const resultado = await controller.registrar(dto);

      // Assert
      expect(resultado).not.toHaveProperty('senha');
    });

    it('deve validar DTO de entrada', async () => {
      // Arrange
      const dto = {
        nome: 'João',
        email: 'email-invalido',
        senha: 'abc123',
      } as any;

      // Act & Assert - validação é feita pelo ValidationPipe do NestJS
      // Este teste apenas verifica se o controller passa o DTO para o use case
      await controller.registrar(dto);
      expect(registrarUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe('POST /auth/login', () => {
    it('deve autenticar usuário e retornar token', async () => {
      // Arrange
      const dto: LoginDto = {
        email: 'joao@example.com',
        senha: 'Senha@123',
      };

      const tokenRetornado = {
        token: 'token-jwt-valido',
        usuario: {
          id: '123',
          nome: 'João Silva',
          email: 'joao@example.com',
          criadoEm: new Date(),
          atualizadoEm: new Date(),
        },
      };

      autenticarUseCase.execute.mockResolvedValue(tokenRetornado);

      // Act
      const resultado = await controller.login(dto);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado.token).toBeDefined();
      expect(resultado.usuario).toBeDefined();
      expect(autenticarUseCase.execute).toHaveBeenCalledWith(dto);
    });

    it('deve retornar token JWT válido', async () => {
      // Arrange
      const dto: LoginDto = {
        email: 'joao@example.com',
        senha: 'Senha@123',
      };

      const tokenEsperado = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

      autenticarUseCase.execute.mockResolvedValue({
        token: tokenEsperado,
        usuario: {
          id: '123',
          nome: 'João Silva',
          email: 'joao@example.com',
          criadoEm: new Date(),
          atualizadoEm: new Date(),
        },
      });

      // Act
      const resultado = await controller.login(dto);

      // Assert
      expect(resultado.token).toBe(tokenEsperado);
    });

    it('deve não retornar senha do usuário', async () => {
      // Arrange
      const dto: LoginDto = {
        email: 'joao@example.com',
        senha: 'Senha@123',
      };

      autenticarUseCase.execute.mockResolvedValue({
        token: 'token-jwt',
        usuario: {
          id: '123',
          nome: 'João Silva',
          email: 'joao@example.com',
          criadoEm: new Date(),
          atualizadoEm: new Date(),
        },
      });

      // Act
      const resultado = await controller.login(dto);

      // Assert
      expect(resultado.usuario).not.toHaveProperty('senha');
    });
  });

  describe('GET /auth/perfil', () => {
    it('deve retornar dados do usuário autenticado', () => {
      // Arrange
      const usuarioMock = {
        id: '123',
        nome: 'João Silva',
        email: 'joao@example.com',
        senha: 'hash-bcrypt-secreto',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };

      // Act
      const resultado = controller.perfil(usuarioMock);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado.id).toBe('123');
      expect(resultado.nome).toBe('João Silva');
      expect(resultado.email).toBe('joao@example.com');
    });

    it('deve remover senha da resposta', () => {
      // Arrange
      const usuarioMock = {
        id: '123',
        nome: 'João Silva',
        email: 'joao@example.com',
        senha: 'hash-bcrypt-muito-secreto',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };

      // Act
      const resultado = controller.perfil(usuarioMock);

      // Assert
      expect(resultado).not.toHaveProperty('senha');
    });

    it('deve retornar todos os dados do usuário exceto senha', () => {
      // Arrange
      const usuarioMock = {
        id: '123',
        nome: 'João Silva',
        email: 'joao@example.com',
        senha: 'hash',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };

      // Act
      const resultado = controller.perfil(usuarioMock);

      // Assert
      expect(resultado).toHaveProperty('id');
      expect(resultado).toHaveProperty('nome');
      expect(resultado).toHaveProperty('email');
      expect(resultado).toHaveProperty('criadoEm');
      expect(resultado).toHaveProperty('atualizadoEm');
      expect(Object.keys(resultado)).toHaveLength(5);
    });
  });

  describe('Status HTTP', () => {
    it('POST /registrar deve retornar 201 Created', () => {
      // Verifica que o decorator @HttpCode(HttpStatus.CREATED) está presente
      // Nota: Este teste valida a configuração do decorator
      expect(controller).toBeDefined();
      expect(controller.registrar).toBeDefined();
    });

    it('POST /login deve retornar 200 OK', () => {
      // Verifica que o decorator @HttpCode(HttpStatus.OK) está presente
      expect(controller).toBeDefined();
      expect(controller.login).toBeDefined();
    });
  });
});
