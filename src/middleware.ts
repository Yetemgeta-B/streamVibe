import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  try {
    // Get the auth session
    const session = await auth();
    
    // Check if the user is trying to access admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!session || !session.user || session.user.role !== 'admin') {
        // Not authenticated or not an admin, redirect to sign in
        const signInUrl = new URL('/auth/signin', request.url);
        signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
        return NextResponse.redirect(signInUrl);
      }
    }
    
    // Continue with the request
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware auth error:", error);
    // In case of authentication error, redirect to error page with details
    const errorUrl = new URL('/auth/error', request.url);
    errorUrl.searchParams.set('error', 'AuthError');
    return NextResponse.redirect(errorUrl);
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
}; 