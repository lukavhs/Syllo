/**
 * Validates environment variables once at startup. A missing or weak setting crashes
 * the app immediately with a clear message, instead of failing later on the first login.
 */
export interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  PORT: number;
  WEB_ORIGIN: string;
}

export function validateEnv(raw: Record<string, unknown>): Env {
  const str = (key: string, fallback?: string): string => {
    const value = raw[key] ?? fallback;
    if (typeof value !== 'string' || value === '') {
      throw new Error(`Missing environment variable ${key} (see api/.env.example)`);
    }
    return value;
  };

  const jwtSecret = str('JWT_SECRET');
  if (jwtSecret.length < 32 || jwtSecret === 'change-me') {
    throw new Error('JWT_SECRET must be a random string of at least 32 characters');
  }

  return {
    DATABASE_URL: str('DATABASE_URL'),
    JWT_SECRET: jwtSecret,
    JWT_EXPIRES_IN: str('JWT_EXPIRES_IN', '7d'),
    PORT: Number(str('PORT', '3000')),
    WEB_ORIGIN: str('WEB_ORIGIN', 'http://localhost:5173'),
  };
}
