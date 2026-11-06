import { execSync } from 'node:child_process';
import pg from 'pg';
import { testDatabaseUrl } from './test-db.js';

/** Runs once before all e2e tests: make sure the test DB exists and has the latest migrations. */
export default async function setup(): Promise<void> {
  const testUrl = new URL(testDatabaseUrl());
  const dbName = testUrl.pathname.slice(1);

  // Connect to the default "postgres" database to create the test database if it's missing.
  const adminUrl = new URL(testUrl);
  adminUrl.pathname = '/postgres';
  const client = new pg.Client({ connectionString: adminUrl.toString() });
  await client.connect();
  const exists = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
  if (exists.rowCount === 0) await client.query(`CREATE DATABASE "${dbName}"`);
  await client.end();

  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: testUrl.toString() },
    stdio: 'inherit',
  });
}
