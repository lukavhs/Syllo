import { ForbiddenException, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from './auth.decorators.js';
import type { AuthUser } from './auth.types.js';
import { RolesGuard } from './roles.guard.js';

/** Builds a fake ExecutionContext for a handler decorated with `roles` (or none). */
function contextFor(roles: Role[] | undefined, user: AuthUser | undefined): ExecutionContext {
  const handler = () => undefined;
  if (roles) Reflect.defineMetadata(ROLES_KEY, roles, handler);
  return {
    getHandler: () => handler,
    getClass: () => class {},
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as unknown as ExecutionContext; // only the methods the guard calls are faked
}

const userWith = (role: Role): AuthUser => ({ userId: 'u1', centerId: 'c1', role });

describe('RolesGuard', () => {
  const guard = new RolesGuard(new Reflector());

  it('allows any signed-in role when the route has no @Roles', () => {
    for (const role of Object.values(Role)) {
      expect(guard.canActivate(contextFor(undefined, userWith(role)))).toBe(true);
    }
  });

  it('allows a listed role', () => {
    expect(guard.canActivate(contextFor([Role.ADMIN, Role.ASSISTANT], userWith(Role.ASSISTANT)))).toBe(true);
  });

  it('forbids an unlisted role with 403', () => {
    expect(() => guard.canActivate(contextFor([Role.ADMIN], userWith(Role.TUTOR)))).toThrow(ForbiddenException);
    expect(() => guard.canActivate(contextFor([Role.ADMIN], userWith(Role.ASSISTANT)))).toThrow(ForbiddenException);
  });

  it('forbids a restricted route when there is no user at all', () => {
    expect(() => guard.canActivate(contextFor([Role.ADMIN], undefined))).toThrow(ForbiddenException);
  });
});
