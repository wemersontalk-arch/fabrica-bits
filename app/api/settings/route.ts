import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-server';
import { db } from '@/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const sessionUser = await getServerSession();

    if (!sessionUser || (sessionUser.role !== 'MASTER' && sessionUser.role !== 'admin')) {
      return NextResponse.json({ success: false, error: 'Acesso negado.' }, { status: 403 });
    }

    const body = await request.json();
    const updatedSettings = db.updateSystemSettings(body);

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
