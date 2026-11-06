import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import type { Env } from '../config/env.js';

/**
 * The one database client for the whole app. Nest creates a single instance and injects
 * it wherever it's asked for, so every request shares one connection pool.
 * Prisma 7 talks to Postgres through a "driver adapter" (here the `pg` driver).
 *
 * Tenancy rule: every query on center-owned data must filter by the caller's
 * `centerId` from the JWT (see AuthUser), never by a centerId sent by the client.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor(config: ConfigService<Env, true>) {
    super({ adapter: new PrismaPg({ connectionString: config.get('DATABASE_URL', { infer: true }) }) });
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
