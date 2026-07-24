import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    // Decode using built-in atob (runs in Edge runtime)
    const payload = JSON.parse(atob(parts[1]));
    return payload as { userId: string; role: string; email: string; name: string };
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  const isAuthPage = pathname.startsWith('/login');
  const isAdminPage = pathname.startsWith('/admin');
  const isAccountPage = pathname.startsWith('/cuenta');
  const isCheckoutPage = pathname.startsWith('/checkout');

  let user = null;
  if (token) {
    user = decodeJwt(token);
  }

  // Admin route protection
  if (isAdminPage) {
    if (!user) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    
    if (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE') {
      // Clients are not allowed on admin pages
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Customer private pages protection
  if (isAccountPage || isCheckoutPage) {
    if (!user) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users trying to access login/register
  if (isAuthPage && user) {
    if (user.role === 'ADMIN' || user.role === 'EMPLOYEE') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/cuenta', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/cuenta/:path*', '/checkout/:path*', '/login'],
};
