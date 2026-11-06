import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, Role } from '@prisma/client';
import { compare, hash, hashSync } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import type { LoginDto, RegisterCenterDto } from './auth.dto.js';
import type { AuthUser, JwtPayload } from './auth.types.js';

const BCRYPT_COST = 12;

// Compared against when the email doesn't exist, so "unknown email" takes as long as
// "wrong password". Otherwise response timing would reveal which emails have accounts.
const DUMMY_HASH = hashSync('timing-equalizer-not-a-real-password', BCRYPT_COST);

const userWithCenter = { center: { select: { id: true, name: true } } } satisfies Prisma.UserInclude;
type UserWithCenter = Prisma.UserGetPayload<{ include: typeof userWithCenter }>;

/** What the API returns about a user. Built field-by-field so passwordHash can never leak. */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  center: { id: string; name: string };
}

export interface Session {
  accessToken: string;
  user: PublicUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  /** Creates a new center and its first user, who is always the center's ADMIN. */
  async registerCenter(dto: RegisterCenterDto): Promise<Session> {
    const passwordHash = await hash(dto.password, BCRYPT_COST);
    try {
      // Nested write: Prisma creates the Center and the User in one transaction,
      // so we can never end up with a center that has no admin.
      const user = await this.prisma.user.create({
        data: {
          role: Role.ADMIN,
          name: dto.name,
          email: dto.email,
          phone: dto.phone || null,
          passwordHash,
          center: { create: { name: dto.centerName } },
        },
        include: userWithCenter,
      });
      return this.createSession(user);
    } catch (err) {
      // P2002 = unique constraint violated (User.email is @unique).
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('An account with this email already exists');
      }
      throw err;
    }
  }

  async login(dto: LoginDto): Promise<Session> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email }, include: userWithCenter });
    const passwordOk = await compare(dto.password, user?.passwordHash ?? DUMMY_HASH);
    // Same message for both cases, so attackers can't probe which emails exist.
    if (!user || !passwordOk) throw new UnauthorizedException('Wrong email or password');
    return this.createSession(user);
  }

  /** The caller's own profile. Filters by BOTH ids from the token (center scoping). */
  async me(caller: AuthUser): Promise<PublicUser> {
    const user = await this.prisma.user.findFirst({
      where: { id: caller.userId, centerId: caller.centerId },
      include: userWithCenter,
    });
    // Token is valid but the user was deleted (or the token is inconsistent): treat as signed out.
    if (!user) throw new UnauthorizedException('Session is no longer valid');
    return toPublicUser(user);
  }

  private async createSession(user: UserWithCenter): Promise<Session> {
    const payload: JwtPayload = { sub: user.id, centerId: user.centerId, role: user.role };
    return { accessToken: await this.jwt.signAsync(payload), user: toPublicUser(user) };
  }
}

function toPublicUser(user: UserWithCenter): PublicUser {
  return { id: user.id, name: user.name, email: user.email, role: user.role, center: user.center };
}
