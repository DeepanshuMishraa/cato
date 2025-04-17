import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedPaths = [
  '/dashboard',
  '/success',
];

const publicPaths = [
  '/',
  '/sign-in',
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const sessionCookie = getSessionCookie(request);

  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.includes('favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Check if the path is a protected route
  const isProtectedRoute = protectedPaths.some(route => path.startsWith(route));

  // If it's a protected route and there's no session, redirect to sign-in
  if (isProtectedRoute && !sessionCookie) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirectUrl', path);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}
s
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
