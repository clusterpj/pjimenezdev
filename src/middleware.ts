import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// English lives at /, Spanish at /es/* (per CLAUDE.md i18n).
// Unprefixed paths are rewritten to /en/* internally; explicit /en/* redirects
// to the canonical unprefixed URL.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en/, '') || '/';
    return NextResponse.redirect(url, 308);
  }

  if (pathname === '/es' || pathname.startsWith('/es/')) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
