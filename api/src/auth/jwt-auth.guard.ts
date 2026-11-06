import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './auth.decorators.js';
import type { AuthedRequest, JwtPayload } from './auth.types.js';

/**
 * Registered globally, so EVERY route requires a valid token unless marked @Public().
 * "Secure by default": forgetting a decorator makes a route too strict, never too open.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [ctx.getHandler(), ctx.getClass()]);
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest<AuthedRequest>();
    const [scheme, token] = req.headers.authorization?.split(' ') ?? [];
    if (scheme !== 'Bearer' || !token) throw new UnauthorizedException('Not signed in');

    try {
      // Checks the signature (made with our JWT_SECRET) and the expiry date.
      const payload = await this.jwt.verifyAsync<JwtPayload>(token);
      req.user = { userId: payload.sub, centerId: payload.centerId, role: payload.role };
    } catch {
      throw new UnauthorizedException('Session is invalid or expired');
    }
    return true;
  }
}
