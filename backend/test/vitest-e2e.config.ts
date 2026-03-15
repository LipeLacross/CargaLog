import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.e2e-spec.ts'],
    setupFiles: ['./test/vitest-setup.ts'],
  },
  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, './src/domain'),
      '@application': path.resolve(__dirname, './src/application'),
      '@frameworks': path.resolve(__dirname, './src/frameworks'),
      '@interface-adapters': path.resolve(
        __dirname,
        './src/interface-adapters',
      ),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
});
