import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authApi } from './auth.api';

vi.mock('./client', () => ({
  __esModule: true,
  default: {
    post: vi.fn(() => Promise.resolve({ data: {} })),
    get: vi.fn(() => Promise.resolve({ data: {} })),
    patch: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve ter função registrar', () => {
    expect(typeof authApi.registrar).toBe('function');
  });

  it('deve ter função login', () => {
    expect(typeof authApi.login).toBe('function');
  });

  it('deve ter função perfil', () => {
    expect(typeof authApi.perfil).toBe('function');
  });

  it('deve ter função atualizarPerfil', () => {
    expect(typeof authApi.atualizarPerfil).toBe('function');
  });

  it('deve ter função esqueciSenha', () => {
    expect(typeof authApi.esqueciSenha).toBe('function');
  });

  it('deve ter função confirmarResetSenha', () => {
    expect(typeof authApi.confirmarResetSenha).toBe('function');
  });
});
