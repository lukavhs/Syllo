import request from 'supertest';
import { createTestApp, type TestContext } from './helpers.js';

describe('Health check (e2e)', () => {
  let ctx: TestContext;

  beforeAll(async () => {
    ctx = await createTestApp();
  });
  afterAll(async () => {
    await ctx.app.close();
  });

  it('GET / is public', () => {
    return request(ctx.app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });
});
