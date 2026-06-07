const { parseCookies, verifyToken } = require('../../../../lib/session');

export async function GET(req) {
    try {
        const cookieHeader = req.headers.get('cookie');
        const cookies = parseCookies(cookieHeader);
        const token = cookies['iecbp_session'];
        if (!token) return new Response(JSON.stringify({ ok: false }), { status: 401, headers: { 'Content-Type': 'application/json' } });

        try {
            const payload = verifyToken(token);
            return new Response(JSON.stringify({ ok: true, user: payload }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } catch (e) {
            return new Response(JSON.stringify({ ok: false }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
    } catch (error) {
        console.error('SESSION ERROR', error);
        return new Response(JSON.stringify({ ok: false }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
