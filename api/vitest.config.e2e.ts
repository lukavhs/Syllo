import { defineConfig } from 'vitest/config';
import { testDatabaseUrl } from './test/test-db.js';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    globalSetup: ['./test/global-setup.ts'],
    // Point the app at the test database. Real env vars win over .env, so this overrides it.
    env: { DATABASE_URL: testDatabaseUrl() },
    // Test files share one database, so run them one at a time.
    fileParallelism: false,
  },
});
