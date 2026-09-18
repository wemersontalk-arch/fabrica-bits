import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-server';
import { db } from '@/db';

export async function GET() {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const systemSettings = db.getSystemSettings();
    const usersList = db.getUsers();

    return NextResponse.json({
      authenticated: true,
      user,
      systemSettings,
      usersList,
    });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, user: null, error: error.message }, { status: 500 });
  }
}
