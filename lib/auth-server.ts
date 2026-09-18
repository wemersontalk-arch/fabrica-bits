import crypto from 'crypto';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { User, UserRole, PlanType } from '@/types/infoproduct';

const JWT_SECRET = process.env.JWT_SECRET || 'fabrica_bits_super_secret_jwt_key_2026_master';
const COOKIE_NAME = 'infoproduct_session';

export interface ServerSessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  plan: PlanType;
  exp: number;
}

/**
 * Assina um payload gerando um token JWT HMAC-SHA256 seguro
 */
export function createSessionToken(user: User): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload: ServerSessionPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    plan: user.plan,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 dias
  };
  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payloadEncoded}`)
    .digest('base64url');

  return `${header}.${payloadEncoded}.${signature}`;
}

/**
 * Valida a assinatura de um token JWT HMAC-SHA256
 */
export function verifySessionToken(token: string): ServerSessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payloadEncoded, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payloadEncoded}`)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return null;
    }

    const payloadStr = Buffer.from(payloadEncoded, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadStr) as ServerSessionPayload;

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expirado
    }

    return payload;
  } catch (e) {
    return null;
  }
}

/**
 * Obtém a sessão autenticada do usuário no servidor através do cookie httpOnly
 */
export async function getServerSession(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);

    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    const payload = verifySessionToken(sessionCookie.value);
    if (!payload) {
      return null;
    }

    // Busca usuário atualizado no banco
    const user = db.getUserById(payload.userId);
    if (!user || user.status === 'blocked') {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      status: user.status,
      isExempt: user.isExempt,
      credits: user.credits,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
  } catch (e) {
    return null;
  }
}

/**
 * Configuração de opções do Cookie HTTP-Only seguro
 */
export function getSessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true, // Proteção total contra roubo por XSS
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 dias em segundos
  };
}
