import { beforeAll, vi } from 'vitest';

beforeAll(() => {
  vi.mock('winston', () => ({
    createLogger: vi.fn().mockReturnValue({
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
      log: vi.fn(),
    }),
    format: {
      combine: vi.fn(),
      timestamp: vi.fn(),
      errors: vi.fn(),
      splat: vi.fn(),
      json: vi.fn(),
      colorize: vi.fn(),
      printf: vi.fn(),
    },
    transports: {
      Console: vi.fn(),
      File: vi.fn(),
    },
  }));

  vi.mock('dotenv', () => ({
    config: vi.fn(),
  }));

  vi.stubEnv('JWT_SECRET', 'test_secret_key_for_testing_purposes_only_32_chars');
  vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test');
  vi.stubEnv('LOG_LEVEL', 'error');
  vi.stubEnv('NODE_ENV', 'test');
  vi.stubEnv('PORT', '3000');
});

vi.mock('@nestjs/config', () => ({
  ConfigModule: {},
  ConfigService: class {
    get(key: string, defaultValue?: string) {
      return process.env[key] || defaultValue;
    }
  },
}));
