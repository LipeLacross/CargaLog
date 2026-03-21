import { vi } from 'vitest';

const storage: Record<string, string> = {};

vi.mock('@react-native-async-storage/async-storage', () => ({
  setItem: vi.fn((key: string, value: string) => {
    storage[key] = value;
    return Promise.resolve();
  }),
  getItem: vi.fn((key: string) => {
    return Promise.resolve(storage[key] ?? null);
  }),
  removeItem: vi.fn((key: string) => {
    delete storage[key];
    return Promise.resolve();
  }),
  clear: vi.fn(() => {
    Object.keys(storage).forEach(key => delete storage[key]);
    return Promise.resolve();
  }),
  getAllKeys: vi.fn(() => Promise.resolve(Object.keys(storage))),
  default: {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    getAllKeys: vi.fn(),
  },
}));
