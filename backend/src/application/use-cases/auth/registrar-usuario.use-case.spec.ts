import { Test, TestingModule } from '@nestjs/testing';
import { RegistrarUsuarioUseCase } from './registrar-usuario.use-case';
import { IUsuarioRepository } from '../../../domain/repositories/usuario.repository.interface';
import { RegistrarUsuarioDto } from '../../dto/auth/registrar-usuario.dto';
import { ConflictException } from '@nestjs/common';

describe('RegistrarUsuarioUseCase', () => {
  let useCase: RegistrarUsuarioUseCase;
  let repository: jest.Mocked<IUsuarioRepository>;

  const mockRepositorio: jest.Mocked<IUsuarioRepository> = {
    criar: jest.fn(),
    buscarPorId: jest.fn(),
    buscarPorEmail: jest.fn(),
    existeEmail: jest.fn(),
    atualizar: jest.fn(),
    deletar: jest.fn(),
    listar: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrarUsuarioUseCase,
        {
          provide: 'IUsuarioRepository',
          useValue: mockRepositorio,
        },
      ],
    }).compile();

    useCase = module.get<RegistrarUsuarioUseCase>(RegistrarUsuarioUseCase);
    repository =
      module.get<jest.Mocked<IUsuarioRepository>>('IUsuarioRepository');
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
