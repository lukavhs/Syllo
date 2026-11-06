import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { Public } from './auth/auth.decorators.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /** Public health check (also handy for waking the sleeping Render instance). */
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
