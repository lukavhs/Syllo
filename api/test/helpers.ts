import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { hash } from 'bcryptjs';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import type { JwtPayload } from '../src/auth/auth.types.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

export interface TestContext {
  app: INestApplication<App>;
  prisma: PrismaService;
  jwt: JwtService;
}

export async function createTestApp(): Promise<TestContext> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleRef.createNestApplication<INestApplication<App>>();
  await app.init();
  return { app, prisma: app.get(PrismaService), jwt: app.get(JwtService) };
}

/** Empties every table. Every table references Center, so CASCADE clears them all. */
export async function resetDb(prisma: PrismaService): Promise<void> {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Center" CASCADE');
}

export const PASSWORD = 'correct-horse-battery';

/** Registers a center through the real endpoint; returns its admin's token and ids. */
export async function registerCenter(app: INestApplication<App>, centerName: string, email: string) {
  const res = await request(app.getHttpServer())
    .post('/auth/register-center')
    .send({ centerName, name: `${centerName} Admin`, email, password: PASSWORD })
    .expect(201);
  const body = res.body as { accessToken: string; user: { id: string; center: { id: string } } };
  return { token: body.accessToken, userId: body.user.id, centerId: body.user.center.id };
}

/** Adds an assistant or tutor directly in the DB (their own endpoints come on Day 2). */
export async function addUser(ctx: TestContext, centerId: string, role: Role, email: string) {
  const user = await ctx.prisma.user.create({
    data: { centerId, role, name: `Test ${role}`, email, passwordHash: await hash(PASSWORD, 4) },
  });
  const payload: JwtPayload = { sub: user.id, centerId, role };
  return { token: await ctx.jwt.signAsync(payload), userId: user.id };
}
