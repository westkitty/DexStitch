import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use jsdom environment for DOM-dependent tests
    environment: 'jsdom',
    
    // Global test setup
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'packages/*/dist/',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/fixtures.ts'
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70
      }
    },
    
    // Ignore node_modules during discovery
    testTimeout: 10000
  }
});
