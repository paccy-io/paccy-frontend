import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Authentication disabled - all pages are now public
  // This allows access to dashboard and all other pages without authentication
  return NextResponse.next();
}

function checkAuthentication(request: NextRequest): boolean {
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
