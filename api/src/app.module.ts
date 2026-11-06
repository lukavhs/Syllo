import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { validateEnv } from './config/env.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Registered here (not in main.ts) so tests that build AppModule get the same validation.
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // strip fields the DTO doesn't declare…
        forbidNonWhitelisted: true, // …and reject the request if any were sent
        transform: true, // turn the JSON body into a real DTO instance (runs @Transform)
      }),
    },
  ],
})
export class AppModule {}
