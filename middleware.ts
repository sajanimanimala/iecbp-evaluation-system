import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware: protects selected routes by validating the presence of the session cookie.
 *
 * Behavior:
 * - If the session cookie is present, allows the request to continue.
 * - If the session cookie is missing, redirects to /login.
 */

async function validateSession(req: NextRequest) {
    const hasSessionCookie = req.cookies.has('iecbp_session');

    console.log('[middleware] validating session for', req.nextUrl.pathname);
    console.log('[middleware] session cookie present:', hasSessionCookie);

    if (!hasSessionCookie) {
        return null;
    }

    return { authenticated: true };
}

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    console.log('[TRACE] middleware entered', { pathname, url: req.url, method: req.method });

    // Validate session by calling internal session endpoint
    const user = await validateSession(req);

    if (!user) {
        console.log('[TRACE] middleware redirect -> /login', { reason: 'validateSession returned no user', pathname, url: req.url });
        // Not authenticated -> redirect to login
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    console.log('[TRACE] middleware authenticated', { pathname });

    console.log('[TRACE] middleware access granted, continuing request', { pathname });

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin/:path*',
        '/evaluator/:path*',
        '/reports/:path*',
        '/scenarios/:path*',
    ],
};
