import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  ignoredRoutes: ['/sign-in(.*)', '/sign-up(.*)', '/api/webhooks/clerk', '/api/webhooks/stripe'],
});

export const config = {
  matcher: [
    // Include your API route and other necessary routes
    '/api/webhooks/clerk(.*)',
    '/api/webhooks/stripe(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    // Ensure Next.js internals and static files are excluded
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
