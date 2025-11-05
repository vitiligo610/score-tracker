import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

export default authkitMiddleware();

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * 1. ^/(\\)?: The root path (with or without a trailing slash)
     * 2. _next: Next.js internal files
     * 3. api: API routes
     * 4. favicon.ico, globals.css, etc: Static assets/root files
     */
    "/((?!_next|api|favicon.ico|globals.css|\\.).*)"
  ],
};