import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-server';
import { db } from '@/db';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const sessionUser = await getServerSession();

    if (!sessionUser || (sessionUser.role !== 'MASTER' && sessionUser.role !== 'admin')) {
      return NextResponse.json({ success: false, error: 'Acesso negado.' }, { status: 403 });
    }

    const userId = params.id;
    const existing = db.getUserById(userId);

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Usuário não encontrado.' }, { status: 404 });
    }

    const body = await request.json();
    const updated = db.saveUser({
      ...existing,
      ...body,
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
