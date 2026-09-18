import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-server';
import { db } from '@/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sessionUser = await getServerSession();

    if (!sessionUser || (sessionUser.role !== 'MASTER' && sessionUser.role !== 'admin' && sessionUser.role !== 'EQUIPE_SUPORTE')) {
      return NextResponse.json({ success: false, error: 'Acesso negado.' }, { status: 403 });
    }

    const users = db.getUsers();
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getServerSession();
    const body = await request.json();

    // Se o usuário está criando via formulário de cadastro ou plano
    if (!sessionUser && body.action === 'register') {
      const cleanEmail = body.email.trim().toLowerCase();
      let user = db.getUserByEmail(cleanEmail);

      if (user) {
        return NextResponse.json({ success: false, error: 'E-mail já cadastrado.' }, { status: 400 });
      }

      user = db.saveUser({
        id: `user_${Date.now()}`,
        name: body.name || cleanEmail.split('@')[0].toUpperCase(),
        email: cleanEmail,
        role: body.role || 'PRODUTOR_INICIANTE',
        plan: body.plan || 'iniciante',
        status: body.autoApprove ? 'active' : 'pending_beta',
        isExempt: false,
        credits: body.plan === 'pro' || body.plan === 'agencia' ? 999 : 50,
        createdAt: new Date().toLocaleDateString('pt-BR'),
      });

      return NextResponse.json({ success: true, user });
    }

    if (!sessionUser || (sessionUser.role !== 'MASTER' && sessionUser.role !== 'admin')) {
      return NextResponse.json({ success: false, error: 'Acesso negado.' }, { status: 403 });
    }

    const updatedUser = db.saveUser(body.user);
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
