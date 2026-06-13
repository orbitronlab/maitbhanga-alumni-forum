import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Route patterns
const publicRoutes = ['/', '/about', '/alumni-directory', '/events', '/news', '/gallery', '/contact', '/donate'];
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
const memberRoutes = ['/dashboard', '/profile', '/donations', '/my-events', '/notifications', '/messages', '/settings'];
const adminRoutes = ['/admin'];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const isLoggedIn = !!session;
  const userRole = session?.user?.role;

  // Allow public static assets and API auth routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/auth/verify-otp') ||
    pathname.startsWith('/api/auth/resend-otp') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // If logged in and trying to access auth pages, redirect to dashboard
  if (isLoggedIn && authRoutes.some((r) => pathname.startsWith(r))) {
    const redirectTo = ['SUPER_ADMIN', 'ADMIN'].includes(userRole ?? '')
      ? '/admin/dashboard'
      : '/dashboard';
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  // If not logged in and trying to access protected routes
  if (!isLoggedIn && memberRoutes.some((r) => pathname.startsWith(r))) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes - require ADMIN or SUPER_ADMIN role
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!['SUPER_ADMIN', 'ADMIN'].includes(userRole ?? '')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
