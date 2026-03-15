import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach, Mocked } from 'vitest';
import { AutenticarUsuarioUseCase } from './autenticar-usuario.use-case';
import { IUsuarioRepository } from '../../../domain/repositories/usuario.repository.interface';
import { LoginDto } from '../../dto/auth/login.dto';
import { Usuario } from '../../../domain/entities/usuario.entity';
import { LoggerService } from '../../../shared/services/logger.service';

describe('AutenticarUsuarioUseCase', () => {
  let useCase: AutenticarUsuarioUseCase;
  let usuarioRepository: Mocked<IUsuarioRepository>;
  let jwtService: Mocked<JwtService>;
  let logger: Mocked<LoggerService>;

  const mockRepositorio: Mocked<IUsuarioRepository> = {
    criar: vi.fn(),
    buscarPorId: vi.fn(),
    buscarPorEmail: vi.fn(),
    existeEmail: vi.fn(),
    atualizar: vi.fn(),
    deletar: vi.fn(),
    listar: vi.fn(),
  };

  const mockJwtService = {
    sign: vi.fn(),
    verify: vi.fn(),
  };

  const mockLogger: Mocked<LoggerService> = {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    verbose: vi.fn(),
    audit: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutenticarUsuarioUseCase,
        {
          provide: 'IUsuarioRepository',
          useValue: mockRepositorio,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: LoggerService,
          useValue: mockLogger,
        },
      ],
    }).compile();

    useCase = module.get<AutenticarUsuarioUseCase>(AutenticarUsuarioUseCase);
    usuarioRepository =
      module.get<Mocked<IUsuarioRepository>>('IUsuarioRepository');
    jwtService = module.get<Mocked<JwtService>>(JwtService);
    logger = module.get<Mocked<LoggerService>>(LoggerService);
  });

  describe('Caminho Feliz', () => {
    it('deve autenticar usuário com sucesso', async () => {
      const dto: LoginDto = {
        email: 'joao@example.com',
        senha: 'Senha@123',
      };

      const usuarioExistente = {
        id: '123',
        nome: 'João Silva',
        email: 'joao@example.com',
        senha: '$2b$10$hashedPassword',
        treinos: [],
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };

      usuarioRepository.buscarPorEmail.mockResolvedValue(usuarioExistente);

      vi.spyOn(Usuario, 'validarSenha').mockResolvedValue(true);

      jwtService.sign.mockReturnValue('token-jwt-válido');

      const resultado = await useCase.execute(dto);

      expect(resultado).toBeDefined();
      expect(resultado.token).toBe('token-jwt-válido');
      expect(resultado.usuario).toBeDefined();
      expect(resultado.usuario.id).toBe('123');
      expect(resultado.usuario).not.toHaveProperty('senha');
      expect(usuarioRepository.buscarPorEmail).toHaveBeenCalledWith(dto.email);
      expect(jwtService.sign).toHaveBeenCalled();
      expect(logger.audit).toHaveBeenCalledWith(
        expect.objectContaining({
          usuarioId: '123',
          acao: 'LOGIN_SUCESSO',
        }),
      );
    });

    it('deve retornar token JWT válido', async () => {
      const dto: LoginDto = {
        email: 'joao@example.com',
        senha: 'Senha@123',
      };

      const usuarioExistente = {
        id: '123',
        nome: 'João Silva',
        email: 'joao@example.com',
        senha: '$2b$10$hashedPassword',
        treinos: [],
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };

      usuarioRepository.buscarPorEmail.mockResolvedValue(usuarioExistente);
      vi.spyOn(Usuario, 'validarSenha').mockResolvedValue(true);

      const tokenEsperado = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      jwtService.sign.mockReturnValue(tokenEsperado);

      const resultado = await useCase.execute(dto);

      expect(resultado.token).toBe(tokenEsperado);
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: '123',
          email: 'joao@example.com',
        }),
      );
    });
  });

  describe('Casos de Exceção', () => {
    it('deve lançar exceção se usuário não encontrado', async () => {
      const dto: LoginDto = {
        email: 'naoexiste@example.com',
        senha: 'Senha@123',
      };

      usuarioRepository.buscarPorEmail.mockResolvedValue(null);

      await expect(useCase.execute(dto)).rejects.toThrow(UnauthorizedException);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('deve lançar exceção se senha está incorreta', async () => {
      const dto: LoginDto = {
        email: 'joao@example.com',
        senha: 'SenhaErrada@123',
      };

      const usuarioExistente = {
        id: '123',
        nome: 'João Silva',
        email: 'joao@example.com',
        senha: '$2b$10$hashedPassword',
        treinos: [],
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };

      usuarioRepository.buscarPorEmail.mockResolvedValue(usuarioExistente);
      vi.spyOn(Usuario, 'validarSenha').mockResolvedValue(false);

      await expect(useCase.execute(dto)).rejects.toThrow(UnauthorizedException);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('deve lançar UnauthorizedException com mensagem genérica', async () => {
      const dto: LoginDto = {
        email: 'joao@example.com',
        senha: 'SenhaErrada@123',
      };

      usuarioRepository.buscarPorEmail.mockResolvedValue(null);

      await expect(useCase.execute(dto)).rejects.toThrow(
        'Credenciais inválidas',
      );
    });
  });

  describe('Validações', () => {
    it('não deve retornar senha do usuário', async () => {
      const dto: LoginDto = {
        email: 'joao@example.com',
        senha: 'Senha@123',
      };

      const usuarioExistente = {
        id: '123',
        nome: 'João Silva',
        email: 'joao@example.com',
        senha: '$2b$10$hashedPassword-muito-secreto',
        treinos: [],
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };

      usuarioRepository.buscarPorEmail.mockResolvedValue(usuarioExistente);
      vi.spyOn(Usuario, 'validarSenha').mockResolvedValue(true);
      jwtService.sign.mockReturnValue('token');

      const resultado = await useCase.execute(dto);

      expect(resultado.usuario).not.toHaveProperty('senha');
    });

    it('deve buscar usuário por email normalizado', async () => {
      const dto: LoginDto = {
        email: 'JOAO@EXAMPLE.COM',
        senha: 'Senha@123',
      };

      usuarioRepository.buscarPorEmail.mockResolvedValue(null);

      await expect(useCase.execute(dto)).rejects.toThrow();
      expect(usuarioRepository.buscarPorEmail).toHaveBeenCalledWith(dto.email);
    });
  });
});
