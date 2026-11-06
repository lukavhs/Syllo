import { Role } from '@prisma/client';
import request from 'supertest';
import type { JwtPayload } from '../src/auth/auth.types.js';
import { JwtService } from '@nestjs/jwt';
import { PASSWORD, addUser, createTestApp, registerCenter, resetDb, type TestContext } from './helpers.js';

describe('Auth (e2e)', () => {
  let ctx: TestContext;
  const http = () => request(ctx.app.getHttpServer());

  beforeAll(async () => {
    ctx = await createTestApp();
  });
  beforeEach(async () => {
    await resetDb(ctx.prisma);
  });
  afterAll(async () => {
    await ctx.app.close();
  });

  describe('POST /auth/register-center (public)', () => {
    const valid = {
      centerName: 'Zamalek Learning Center',
      name: 'Mariam Adel',
      email: 'Mariam@Example.com ',
      phone: '+20 100 000 0000',
      password: PASSWORD,
    };

    it('creates the center and makes the registrant its ADMIN', async () => {
      const res = await http().post('/auth/register-center').send(valid).expect(201);

      expect(res.body.accessToken).toEqual(expect.any(String));
      expect(res.body.user).toMatchObject({
        name: 'Mariam Adel',
        email: 'mariam@example.com', // trimmed + lowercased
        role: Role.ADMIN,
        center: { name: 'Zamalek Learning Center' },
      });
      expect(JSON.stringify(res.body)).not.toContain('passwordHash');

      const stored = await ctx.prisma.user.findUniqueOrThrow({ where: { email: 'mariam@example.com' } });
      expect(stored.passwordHash).not.toBe(PASSWORD); // hashed, never stored as-is
    });

    it('rejects a duplicate email (case-insensitive) with 409', async () => {
      await http().post('/auth/register-center').send(valid).expect(201);
      await http()
        .post('/auth/register-center')
        .send({ ...valid, email: 'MARIAM@example.com' })
        .expect(409);
    });

    it('rejects a client trying to choose its own role or center', async () => {
      await http().post('/auth/register-center').send({ ...valid, role: Role.TUTOR }).expect(400);
      await http().post('/auth/register-center').send({ ...valid, centerId: 'someone-elses' }).expect(400);
    });

    it('validates the body', async () => {
      await http().post('/auth/register-center').send({ ...valid, password: 'short' }).expect(400);
      await http().post('/auth/register-center').send({ ...valid, email: 'not-an-email' }).expect(400);
      await http().post('/auth/register-center').send({ ...valid, centerName: '   ' }).expect(400);
    });
  });

  describe('POST /auth/login (public)', () => {
    it.each([Role.ADMIN, Role.ASSISTANT, Role.TUTOR])('lets a %s sign in', async (role) => {
      const { centerId } = await registerCenter(ctx.app, 'Center A', 'admin@a.test');
      const email = role === Role.ADMIN ? 'admin@a.test' : `${role.toLowerCase()}@a.test`;
      if (role !== Role.ADMIN) await addUser(ctx, centerId, role, email);

      const res = await http().post('/auth/login').send({ email, password: PASSWORD }).expect(200);
      expect(res.body.user).toMatchObject({ email, role, center: { id: centerId } });
    });

    it('gives the same 401 for a wrong password and an unknown email', async () => {
      await registerCenter(ctx.app, 'Center A', 'admin@a.test');
      const wrongPw = await http().post('/auth/login').send({ email: 'admin@a.test', password: 'nope-nope' }).expect(401);
      const noUser = await http().post('/auth/login').send({ email: 'ghost@a.test', password: PASSWORD }).expect(401);
      expect(wrongPw.body.message).toBe(noUser.body.message);
    });
  });

  describe('GET /auth/me (any signed-in role)', () => {
    it('rejects requests with no token or a bad token', async () => {
      await http().get('/auth/me').expect(401);
      await http().get('/auth/me').set('Authorization', 'Bearer not-a-jwt').expect(401);
    });

    it('rejects a token signed with a different secret (forged)', async () => {
      const { userId, centerId } = await registerCenter(ctx.app, 'Center A', 'admin@a.test');
      const forger = new JwtService({ secret: 'attacker-secret-attacker-secret-attacker' });
      const forged = await forger.signAsync({ sub: userId, centerId, role: Role.ADMIN } satisfies JwtPayload);
      await http().get('/auth/me').set('Authorization', `Bearer ${forged}`).expect(401);
    });

    it.each([Role.ADMIN, Role.ASSISTANT, Role.TUTOR])('returns the %s their own profile', async (role) => {
      const admin = await registerCenter(ctx.app, 'Center A', 'admin@a.test');
      const caller = role === Role.ADMIN ? admin : await addUser(ctx, admin.centerId, role, 'x@a.test');

      const res = await http().get('/auth/me').set('Authorization', `Bearer ${caller.token}`).expect(200);
      expect(res.body).toMatchObject({ id: caller.userId, role, center: { id: admin.centerId } });
    });

    it('cross-center: each center only ever sees itself', async () => {
      const a = await registerCenter(ctx.app, 'Center A', 'admin@a.test');
      const b = await registerCenter(ctx.app, 'Center B', 'admin@b.test');

      const meA = await http().get('/auth/me').set('Authorization', `Bearer ${a.token}`).expect(200);
      const meB = await http().get('/auth/me').set('Authorization', `Bearer ${b.token}`).expect(200);
      expect(meA.body.center.id).toBe(a.centerId);
      expect(meB.body.center.id).toBe(b.centerId);
    });

    it("cross-center: a token pairing A's user with B's center is refused", async () => {
      const a = await registerCenter(ctx.app, 'Center A', 'admin@a.test');
      const b = await registerCenter(ctx.app, 'Center B', 'admin@b.test');
      // Simulates a bug that signs inconsistent claims; the query filters by both ids, so it fails closed.
      const mixed = await ctx.jwt.signAsync({ sub: a.userId, centerId: b.centerId, role: Role.ADMIN } satisfies JwtPayload);
      await http().get('/auth/me').set('Authorization', `Bearer ${mixed}`).expect(401);
    });

    it('rejects the token of a user who has since been deleted', async () => {
      const a = await registerCenter(ctx.app, 'Center A', 'admin@a.test');
      const tutor = await addUser(ctx, a.centerId, Role.TUTOR, 'tutor@a.test');
      await ctx.prisma.user.delete({ where: { id: tutor.userId } });
      await http().get('/auth/me').set('Authorization', `Bearer ${tutor.token}`).expect(401);
    });
  });
});
