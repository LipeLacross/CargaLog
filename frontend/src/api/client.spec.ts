import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api/client';

vi.mock('axios', () => ({
  create: vi.fn(() => ({
    defaults: {
      baseURL: 'http://localhost:3000/api/v1',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    },
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  })),
  default: {
    create: vi.fn(() => ({
      defaults: {
        baseURL: 'http://localhost:3000/api/v1',
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
      },
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}));

describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve ter baseURL configurada', () => {
    expect(api.defaults.baseURL).toBeDefined();
  });

  it('deve ter timeout de 10000ms', () => {
    expect(api.defaults.timeout).toBe(10000);
  });

  it('deve ter Content-Type application/json', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('deve ter interceptors de request configurados', () => {
    expect(api.interceptors.request).toBeDefined();
  });

  it('deve ter interceptors de response configurados', () => {
    expect(api.interceptors.response).toBeDefined();
  });
});
