import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);
const normalizeEmail = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

/**
 * Body of POST /auth/register-center. Note what is NOT here: role and centerId.
 * The global ValidationPipe rejects unknown fields, so a client can't send `role: "ADMIN"`
 * or another center's id. The server decides both.
 */
export class RegisterCenterDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  centerName: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @Transform(normalizeEmail)
  @IsEmail()
  @MaxLength(254)
  email: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  // bcrypt only uses the first 72 bytes of a password, so longer ones are rejected
  // rather than silently truncated.
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}

export class LoginDto {
  @Transform(normalizeEmail)
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
