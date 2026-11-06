import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import type { Env } from './config/env.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService<Env, true>>(ConfigService);

  // The web app runs on another origin (localhost:5173 / Vercel), so the browser
  // only lets it call this API if we explicitly allow that origin.
  app.enableCors({ origin: config.get('WEB_ORIGIN', { infer: true }) });

  await app.listen(config.get('PORT', { infer: true }));
}
await bootstrap();
