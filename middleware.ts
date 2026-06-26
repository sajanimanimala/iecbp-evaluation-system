import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware: protects selected routes by validating the server session
 * and enforcing role-based authorization.
 *
 * Behavior:
 * - Calls internal /api/auth/session (server) forwarding cookies
 * - If session is valid, optionally enforces role requirements for certain paths
 * - If invalid or unauthorized, redirects to /login
 */

const ROLE_REDIRECT_MAP: Record<string, string> = {
    ADMIN: '/dashboard/admin',
    EVALUATOR: '/dashboard/evaluator',
    CANDIDATE: '/dashboard/candidate',
};

async function validateSession(req: NextRequest) {
    try {
        const hasSessionCookie = req.cookies.has('iecbp_session');

        console.log('[middleware] validating session for', req.nextUrl.pathname);
        console.log('[middleware] session cookie present:', hasSessionCookie);

        if (!hasSessionCookie) {
            console.log('[middleware] session cookie missing');
            return null;
        }

        return { id: 'cookie-authenticated', role: '' };
    } catch (e) {
        console.error('[middleware] session validation error:', e);
        return null;
    }
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

    const role: string = user.role || '';
    console.log('[TRACE] middleware authenticated role', { pathname, role, userId: user.id });

    // Authorization enforcement for admin/evaluator/candidate specific routes
    // Admin-only
    if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard/admin')) {
        console.log('[middleware] checking admin access');
        if (role !== 'ADMIN') {
            const redirect = ROLE_REDIRECT_MAP[role] || '/login';
            console.log('[TRACE] redirect', { from: pathname, to: redirect, reason: 'admin-role-mismatch' });
            return NextResponse.redirect(new URL(redirect, req.url));
        }
        console.log('[middleware] admin access granted');
    }

    // Evaluator-only
    if (pathname.startsWith('/evaluator') || pathname.startsWith('/dashboard/evaluator')) {
        console.log('[middleware] checking evaluator access');
        if (role !== 'EVALUATOR') {
            const redirect = ROLE_REDIRECT_MAP[role] || '/login';
            console.log('[TRACE] redirect', { from: pathname, to: redirect, reason: 'evaluator-role-mismatch' });
            return NextResponse.redirect(new URL(redirect, req.url));
        }
        console.log('[middleware] evaluator access granted');
    }

    // Candidate-only dashboard
    if (pathname.startsWith('/dashboard/candidate')) {
        console.log('[middleware] checking candidate access');
        if (role !== 'CANDIDATE') {
            const redirect = ROLE_REDIRECT_MAP[role] || '/login';
            console.log('[TRACE] redirect', { from: pathname, to: redirect, reason: 'candidate-role-mismatch' });
            return NextResponse.redirect(new URL(redirect, req.url));
        }
        console.log('[middleware] candidate access granted');
    }

    // For /reports and /scenarios we require authenticated users (any role)
    // Additional role checks can be added here if needed.
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
