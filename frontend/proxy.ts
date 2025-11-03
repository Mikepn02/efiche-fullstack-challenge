import { NextResponse, NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/auth/sign-in', '/auth/sign-up', '/', '/guests'];

function decodeJWT(token?: string): { role?: string } | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    // atob is available in edge runtime; fallback to Buffer if present
    const json = typeof atob === 'function'
      ? atob(payload)
      : (globalThis as any).Buffer
        ? (globalThis as any).Buffer.from(payload, 'base64').toString('utf-8')
        : '';
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname.replace(/\/$/, '');


  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }


  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  const headerToken = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : undefined;
  const cookieToken = req.cookies.get('access_token')?.value;
  const token = headerToken || cookieToken;
  const decoded = decodeJWT(token);
  const role = decoded?.role === 'ADMIN' || decoded?.role === 'STAFF'
    ? decoded.role
    : null;

  const isAuthenticated = Boolean(token);
  const isPublic = PUBLIC_PATHS.includes(pathname);

  // Explicitly protect admin/staff routes when no token
  if (!isAuthenticated && (pathname.startsWith('/admin') || pathname.startsWith('/staff'))) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  }

  // not authenticated and trying to access any non-public route
  if (!isAuthenticated && !isPublic) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  }

  // logged-in user trying to access public pages
  if (isAuthenticated && isPublic) {
    const home = role === 'ADMIN' ? '/admin' : '/staff';
    return NextResponse.redirect(new URL(home, req.url));
  }

  // logged-in user accessing guest page
  if (isAuthenticated && pathname === '/guests') {
    const home = role === 'ADMIN' ? '/admin' : '/staff';
    return NextResponse.redirect(new URL(home, req.url));
  }

  // role-based access
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL(role === 'STAFF' ? '/staff' : '/guests', req.url));
  }

  if (pathname.startsWith('/staff') && role !== 'STAFF') {
    return NextResponse.redirect(new URL(role === 'ADMIN' ? '/admin' : '/guests', req.url));
  }

  return NextResponse.next();
}
