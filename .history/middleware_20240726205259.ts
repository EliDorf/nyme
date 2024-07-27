import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define your public routes
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/webhooks/clerk(.*)']);

export default clerkMiddleware((auth, request) => {
  if (isPublicRoute(request)) {
    // If the request matches a public route, allow it to pass without authentication
    return request;
  } else {
    // If the request does not match a public route, enforce authentication
    return auth().protect()(request);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
