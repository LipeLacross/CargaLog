import { beforeAll, vi } from 'vitest';

beforeAll(() => {
  vi.mock('winston', () => ({
    default: {
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
    },
  }));
});
