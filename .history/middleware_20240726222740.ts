import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define your public routes
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/webhooks/clerk(.*)']);

export default clerkMiddleware((auth, request) => {
  if (isPublicRoute(request)) {
    // If the request matches a public route, allow it to pass without authentication
    return NextResponse.next();
  } else {
    // If the request does not match a public route, enforce authentication
    if (!auth.sessionId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Include your API route and other necessary routes
    '/api/webhooks/clerk(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    // Ensure Next.js internals and static files are excluded
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
