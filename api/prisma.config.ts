// Prisma CLI config (Prisma 7+): where the schema and migrations live, and how to reach the DB.
// Only the CLI reads this file (migrate, generate, studio); the running API connects via PrismaService.
import { defineConfig, env } from 'prisma/config';

// Prisma 7 no longer loads .env by itself. Locally we load it here; in production
// (Render) there is no .env file and the variables come from the host instead.
try {
  process.loadEnvFile();
} catch {
  // no .env file: fine, use the real environment
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: env('DATABASE_URL') },
});
