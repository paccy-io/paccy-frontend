import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the request is for a dashboard route
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // In production, completely block dashboard access
    if (process.env.NODE_ENV === "production") {
      // Redirect to custom 403 page
      const forbiddenUrl = new URL("/403", request.url);
      return NextResponse.redirect(forbiddenUrl);
    }

    // In development, check for authentication
    const isAuthenticated = checkAuthentication(request);

    if (!isAuthenticated) {
      // Redirect to auth page if not authenticated
      const authUrl = new URL("/auth", request.url);
      authUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(authUrl);
    }
  }

  return NextResponse.next();
}

function checkAuthentication(request: NextRequest): boolean {
  // Only allow authentication in development
  if (process.env.NODE_ENV !== "development") {
    return false;
  }

  // Check for auth token in cookies
  const authToken = request.cookies.get("auth-token");

  // Return true if auth token exists and is not empty
  return !!(authToken?.value && authToken.value !== "");
}

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all dashboard routes and any other protected routes
     */
    "/dashboard/:path*",
    // Add other protected routes here if needed
    // "/admin/:path*",
    // "/settings/:path*",
  ],
};
