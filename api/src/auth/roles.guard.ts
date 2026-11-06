import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Role } from '@prisma/client';
import { ROLES_KEY } from './auth.decorators.js';
import type { AuthedRequest } from './auth.types.js';

/**
 * Runs after JwtAuthGuard. If the route has @Roles(...), the caller's role must be listed.
 * 401 = "who are you?" (no/bad token). 403 = "I know who you are, and you can't do this."
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const allowed = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES_KEY, [ctx.getHandler(), ctx.getClass()]);
    if (!allowed) return true;

    const { user } = ctx.switchToHttp().getRequest<AuthedRequest>();
    if (!user || !allowed.includes(user.role)) {
      throw new ForbiddenException('You do not have access to this');
    }
    return true;
  }
}
