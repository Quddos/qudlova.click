import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Protect all routes except static files, Clerk auth, and webhooks
    "/((?!_next/static|_next/image|favicon.ico|logo.png|api/webhooks|auth.*).*)",
  ],
}; 