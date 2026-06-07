const { clearCookie } = require('../../../../lib/session');

export async function POST() {
    const cookie = clearCookie();
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookie } });
}
