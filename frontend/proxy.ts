import { NextResponse, NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/auth/sign-in', '/auth/sign-up', '/', '/guests'];

function decodeJWT(token?: string): { role?: string } | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    return JSON.parse(Buffer.from(payload, 'base64').toString());
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname.replace(/\/$/, '');

  // skip Next.js internals and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get('access_token')?.value;
  const decoded = decodeJWT(token);
  const role = decoded?.role === 'ADMIN' || decoded?.role === 'STAFF'
    ? decoded.role
    : null;

  const isAuthenticated = Boolean(token);
  const isPublic = PUBLIC_PATHS.includes(pathname);

  // not authenticated and trying to access protected route
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
