import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'infoproduct_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(COOKIE_NAME)?.value;

  // Rotas que requerem autenticação
  const isProtectedPath =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/criar-produto') ||
    pathname.startsWith('/estudo');

  if (isProtectedPath && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/criar-produto/:path*', '/estudo/:path*'],
};
