import type { Role } from '@prisma/client';
import type { Request } from 'express';

/** What we sign into the JWT. Small on purpose: anyone can base64-decode a JWT and read it. */
export interface JwtPayload {
  sub: string; // user id ("subject" is the standard JWT claim name)
  centerId: string;
  role: Role;
}

/** The logged-in caller, attached to the request by JwtAuthGuard. */
export interface AuthUser {
  userId: string;
  centerId: string;
  role: Role;
}

export type AuthedRequest = Request & { user?: AuthUser };
