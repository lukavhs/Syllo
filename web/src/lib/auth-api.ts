import type { Role } from '../generated/prisma/enums'
import { apiRequest } from './api'

/** Mirrors `PublicUser` in api/src/auth/auth.service.ts. */
export interface PublicUser {
  id: string
  name: string
  email: string
  role: Role
  center: { id: string; name: string }
}

export interface AuthSession {
  accessToken: string
  user: PublicUser
}

export interface RegisterCenterInput {
  centerName: string
  name: string
  email: string
  phone?: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export const authApi = {
  registerCenter: (input: RegisterCenterInput) =>
    apiRequest<AuthSession>('/auth/register-center', { method: 'POST', body: input }),
  login: (input: LoginInput) => apiRequest<AuthSession>('/auth/login', { method: 'POST', body: input }),
  me: () => apiRequest<PublicUser>('/auth/me'),
}
