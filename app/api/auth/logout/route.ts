import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSessionCookieOptions } from '@/lib/auth-server';

export async function POST() {
  try {
    const cookieOptions = getSessionCookieOptions();
    cookies().set(cookieOptions.name, '', { ...cookieOptions, maxAge: 0 });

    return NextResponse.json({ success: true, message: 'Sessão encerrada com sucesso.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
