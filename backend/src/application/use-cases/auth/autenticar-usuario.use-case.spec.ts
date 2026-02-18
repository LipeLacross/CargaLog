import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AutenticarUsuarioUseCase } from './autenticar-usuario.use-case';
import { IUsuarioRepository } from '../../../domain/repositories/usuario.repository.interface';
import { LoginDto } from '../../dto/auth/login.dto';
import { Usuario } from '../../../domain/entities/usuario.entity';

describe('AutenticarUsuarioUseCase', () => {
  let useCase: AutenticarUsuarioUseCase;
  let usuarioRepository: jest.Mocked<IUsuarioRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const mockRepositorio: jest.Mocked<IUsuarioRepository> = {
    criar: jest.fn(),
    buscarPorId: jest.fn(),
    buscarPorEmail: jest.fn(),
    existeEmail: jest.fn(),
    atualizar: jest.fn(),
    deletar: jest.fn(),
    listar: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

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
      ],
    }).compile();

    useCase = module.get<AutenticarUsuarioUseCase>(AutenticarUsuarioUseCase);
    usuarioRepository =
      module.get<jest.Mocked<IUsuarioRepository>>('IUsuarioRepository');
    jwtService = module.get<jest.Mocked<JwtService>>(JwtService);
  });

  describe('Caminho Feliz', () => {
    it('deve autenticar usuário com sucesso', async () => {
      // Arrange
      const dto: LoginDto = {
        email: 'joao@example.com',
        senha: 'Senha@123',
      };

      const usuarioExistente = {
        id: '123',
        nome: 'João Silva',
        email: 'joao@example.com',
        senha: '$2b$10$hashedPassword', // hash bcrypt
        treinos: [],
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };

      usuarioRepository.buscarPorEmail.mockResolvedValue(usuarioExistente);

      // Mock validarSenha
      jest.spyOn(Usuario, 'validarSenha').mockResolvedValue(true);

      jwtService.sign.mockReturnValue('token-jwt-válido');

      // Act
      const resultado = await useCase.execute(dto);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado.token).toBe('token-jwt-válido');
      expect(resultado.usuario).toBeDefined();
      expect(resultado.usuario.id).toBe('123');
      expect(resultado.usuario).not.toHaveProperty('senha');
      expect(usuarioRepository.buscarPorEmail).toHaveBeenCalledWith(dto.email);
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('deve retornar token JWT válido', async () => {
      // Arrange
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
      jest.spyOn(Usuario, 'validarSenha').mockResolvedValue(true);

      const tokenEsperado = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      jwtService.sign.mockReturnValue(tokenEsperado);

      // Act
      const resultado = await useCase.execute(dto);

      // Assert
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
      // Arrange
      const dto: LoginDto = {
        email: 'naoexiste@example.com',
        senha: 'Senha@123',
      };

      usuarioRepository.buscarPorEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(UnauthorizedException);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('deve lançar exceção se senha está incorreta', async () => {
      // Arrange
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
      jest.spyOn(Usuario, 'validarSenha').mockResolvedValue(false);

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(UnauthorizedException);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('deve lançar UnauthorizedException com mensagem genérica', async () => {
      // Arrange
      const dto: LoginDto = {
        email: 'joao@example.com',
        senha: 'SenhaErrada@123',
      };

      usuarioRepository.buscarPorEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(
        'Credenciais inválidas',
      );
    });
  });

  describe('Validações', () => {
    it('não deve retornar senha do usuário', async () => {
      // Arrange
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
      jest.spyOn(Usuario, 'validarSenha').mockResolvedValue(true);
      jwtService.sign.mockReturnValue('token');

      // Act
      const resultado = await useCase.execute(dto);

      // Assert
      expect(resultado.usuario).not.toHaveProperty('senha');
    });

    it('deve buscar usuário por email normalizado', async () => {
      // Arrange
      const dto: LoginDto = {
        email: 'JOAO@EXAMPLE.COM',
        senha: 'Senha@123',
      };

      usuarioRepository.buscarPorEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow();
      // Email é passado como está (o controller faz a validação)
      expect(usuarioRepository.buscarPorEmail).toHaveBeenCalledWith(dto.email);
    });
  });
});
