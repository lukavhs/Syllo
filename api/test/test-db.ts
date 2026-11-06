/**
 * E2E tests run against their own database ("<dev db name>_test") on the same Postgres
 * server, so wiping tables between tests never touches your dev data.
 */
export function testDatabaseUrl(): string {
  try {
    process.loadEnvFile();
  } catch {
    // no .env file (CI): DATABASE_URL must come from the environment
  }
  const devUrl = process.env.DATABASE_URL;
  if (!devUrl) throw new Error('DATABASE_URL is not set');

  const url = new URL(devUrl);
  const dbName = url.pathname.slice(1);
  url.pathname = `/${dbName.endsWith('_test') ? dbName : `${dbName}_test`}`;
  return url.toString();
}
