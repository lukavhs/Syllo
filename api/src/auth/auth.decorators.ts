import { SetMetadata, UnauthorizedException, createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Role } from '@prisma/client';
import type { AuthedRequest, AuthUser } from './auth.types.js';

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';

/** Opts a route out of the global login requirement (sign-up, login, health check). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/** Restricts a route to these roles. Without it, any logged-in user may call the route. */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

/** Injects the logged-in caller: `me(@CurrentUser() user: AuthUser)`. */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthUser => {
  const req = ctx.switchToHttp().getRequest<AuthedRequest>();
  if (!req.user) throw new UnauthorizedException();
  return req.user;
});
