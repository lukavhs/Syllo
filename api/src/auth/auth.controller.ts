import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CurrentUser, Public } from './auth.decorators.js';
import { LoginDto, RegisterCenterDto } from './auth.dto.js';
import { AuthService, type PublicUser, type Session } from './auth.service.js';
import type { AuthUser } from './auth.types.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  /** Anyone can register a new center; they become its admin. */
  @Public()
  @Post('register-center')
  registerCenter(@Body() dto: RegisterCenterDto): Promise<Session> {
    return this.auth.registerCenter(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK) // Nest defaults POST to 201 Created; logging in creates nothing
  login(@Body() dto: LoginDto): Promise<Session> {
    return this.auth.login(dto);
  }

  /** Any signed-in role. The web app calls this on load to restore the session. */
  @Get('me')
  me(@CurrentUser() user: AuthUser): Promise<PublicUser> {
    return this.auth.me(user);
  }
}
