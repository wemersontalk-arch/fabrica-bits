import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { createSessionToken, getSessionCookieOptions } from '@/lib/auth-server';
import { User, UserRole, PlanType } from '@/types/infoproduct';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'E-mail é obrigatório.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Validação estrita do Master Admin
    if (cleanEmail === 'master@infoproductengine.ai' || cleanEmail === 'admin@infoproductengine.ai') {
      if (password && password !== 'admin123') {
        const masterUser = db.getUserByEmail('master@infoproductengine.ai');
        if (masterUser && masterUser.passwordHash && masterUser.passwordHash !== password) {
          return NextResponse.json(
            { success: false, error: 'Senha incorreta para a conta Master Admin.' },
            { status: 401 }
          );
        }
      }

      let masterUser = db.getUserByEmail('master@infoproductengine.ai');
      if (!masterUser) {
        masterUser = db.saveUser({
          id: 'user_master_1',
          name: 'Master Administrador',
          email: 'master@infoproductengine.ai',
          role: 'MASTER',
          plan: 'agencia',
          status: 'active',
          isExempt: true,
          credits: 9999,
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          createdAt: '01/09/2026',
        });
      }

      const userObj: User = {
        id: masterUser.id,
        name: masterUser.name,
        email: masterUser.email,
        role: masterUser.role as UserRole,
        plan: masterUser.plan as PlanType,
        status: masterUser.status as any,
        isExempt: masterUser.isExempt,
        credits: masterUser.credits,
        avatarUrl: masterUser.avatarUrl,
        createdAt: masterUser.createdAt,
      };

      const token = createSessionToken(userObj);
      const cookieOptions = getSessionCookieOptions();

      cookies().set(cookieOptions.name, token, cookieOptions);

      return NextResponse.json({ success: true, user: userObj });
    }

    // Busca usuário no banco
    let user = db.getUserByEmail(cleanEmail);

    if (!user) {
      // Cria novo usuário em pending_beta se não existir
      user = db.saveUser({
        id: `user_${Date.now()}`,
        name: cleanEmail.split('@')[0].toUpperCase(),
        email: cleanEmail,
        role: 'PRODUTOR',
        plan: 'produtor',
        status: 'pending_beta',
        isExempt: false,
        credits: 50,
        createdAt: new Date().toLocaleDateString('pt-BR'),
      });
    }

    if (user.status === 'blocked') {
      return NextResponse.json(
        { success: false, error: 'Sua conta está bloqueada pelo administrador.' },
        { status: 403 }
      );
    }

    const userObj: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
      plan: user.plan as PlanType,
      status: user.status as any,
      isExempt: user.isExempt,
      credits: user.credits,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };

    const token = createSessionToken(userObj);
    const cookieOptions = getSessionCookieOptions();

    cookies().set(cookieOptions.name, token, cookieOptions);

    return NextResponse.json({ success: true, user: userObj });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao realizar login no servidor.' },
      { status: 500 }
    );
  }
}
