import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for a dashboard route
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // In production, always block dashboard access
    if (process.env.NODE_ENV === 'production') {
      // Redirect to home page with a message
      const homeUrl = new URL('/', request.url);
      homeUrl.searchParams.set('error', 'dashboard-unavailable');
      return NextResponse.redirect(homeUrl);
    }
    
    // In development, check for authentication
    const isAuthenticated = checkAuthentication(request);
    
    if (!isAuthenticated) {
      // Redirect to auth page if not authenticated
      const authUrl = new URL('/auth', request.url);
      authUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(authUrl);
    }
  }

  return NextResponse.next();
}

function checkAuthentication(request: NextRequest): boolean {
  // Only allow authentication in development
  if (process.env.NODE_ENV !== 'development') {
    return false;
  }
  
  // Check for auth token in cookies
  const authToken = request.cookies.get('auth-token');
  
  // Return true if auth token exists and is not empty
  return !!(authToken?.value && authToken.value !== '');
}

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all dashboard routes
     */
    '/dashboard/:path*',
  ],
};
