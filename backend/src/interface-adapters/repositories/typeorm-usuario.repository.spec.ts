import { vi, describe, it, expect } from 'vitest';
import { Repository } from 'typeorm';
import { TypeOrmUsuarioRepository } from './typeorm-usuario.repository';
import { Usuario } from '../../domain/entities/usuario.entity';

describe('TypeOrmUsuarioRepository', () => {
  let repository: TypeOrmUsuarioRepository;
  let ormRepository: vi.Mocked<Repository<Usuario>>;

  const buildUsuario = (overrides: Partial<Usuario> = {}): Usuario => ({
    id: 'user-1',
    nome: 'Joao Silva',
    email: 'joao@example.com',
    senha: 'hash',
    treinos: [],
    criadoEm: new Date(),
    atualizadoEm: new Date(),
    ...overrides,
  });

  beforeEach(() => {
    ormRepository = {
      create: vi.fn(),
      save: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    } as unknown as vi.Mocked<Repository<Usuario>>;

    repository = new TypeOrmUsuarioRepository(ormRepository);
  });

  it('deve criar usuario', async () => {
    const input = { nome: 'Joao', email: 'joao@example.com', senha: 'hash' };
    const usuario = buildUsuario({ nome: 'Joao' });

    ormRepository.create.mockReturnValue(usuario);
    ormRepository.save.mockResolvedValue(usuario);

    const result = await repository.criar(input);

    expect(ormRepository.create).toHaveBeenCalledWith(input);
    expect(ormRepository.save).toHaveBeenCalledWith(usuario);
    expect(result).toEqual(usuario);
  });

  it('deve buscar usuario por id', async () => {
    const usuario = buildUsuario();
    ormRepository.findOne.mockResolvedValue(usuario);

    const result = await repository.buscarPorId('user-1');

    expect(ormRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'user-1' },
    });
    expect(result).toEqual(usuario);
  });

  it('deve buscar usuario por email', async () => {
    const usuario = buildUsuario();
    ormRepository.findOne.mockResolvedValue(usuario);

    const result = await repository.buscarPorEmail('joao@example.com');

    expect(ormRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'joao@example.com' },
    });
    expect(result).toEqual(usuario);
  });

  it('deve atualizar usuario', async () => {
    const usuarioAtualizado = buildUsuario({ nome: 'Joao Atualizado' });
    ormRepository.update.mockResolvedValue({} as any);
    ormRepository.findOne.mockResolvedValue(usuarioAtualizado);

    const result = await repository.atualizar('user-1', {
      nome: 'Joao Atualizado',
    });

    expect(ormRepository.update).toHaveBeenCalledWith('user-1', {
      nome: 'Joao Atualizado',
    });
    expect(result).toEqual(usuarioAtualizado);
  });

  it('deve lançar erro ao atualizar usuario inexistente', async () => {
    ormRepository.update.mockResolvedValue({} as any);
    ormRepository.findOne.mockResolvedValue(null);

    await expect(
      repository.atualizar('user-1', { nome: 'Joao Atualizado' }),
    ).rejects.toThrow('Usuário não encontrado após atualização');
  });

  it('deve deletar usuario', async () => {
    ormRepository.delete.mockResolvedValue({} as any);

    await repository.deletar('user-1');

    expect(ormRepository.delete).toHaveBeenCalledWith('user-1');
  });

  it('deve verificar existencia de email', async () => {
    ormRepository.count.mockResolvedValue(1);

    const result = await repository.existeEmail('joao@example.com');

    expect(ormRepository.count).toHaveBeenCalledWith({
      where: { email: 'joao@example.com' },
    });
    expect(result).toBe(true);
  });
});
