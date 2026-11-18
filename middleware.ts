import { NextResponse, type NextRequest } from 'next/server';

/**
 * Optimistic gate: no session cookie -> /sign-in?redirect=<where you wanted to go>.
 * The real role check happens server-side in the dashboard layouts (requireRole),
 * so a logged-in user reloading any private route stays on it.
 */
export function middleware(req: NextRequest) {
  const sessionToken =
    req.cookies.get('better-auth.session_token')?.value ||
    req.cookies.get('__Secure-better-auth.session_token')?.value;

  if (!sessionToken) {
    const url = new URL('/sign-in', req.url);
    url.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*', '/payment/:path*'] };
