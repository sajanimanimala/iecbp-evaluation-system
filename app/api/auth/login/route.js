const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const { signToken, serializeCookie, parseCookies } = require('../../../../lib/session');

export async function POST(req) {
    try {
        const body = await req.json();
        const { email: rawEmail, password } = body;
        const email = (rawEmail || '').trim().toLowerCase();

        if (!email || !password) {
            return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        // authenticated - return safe user info
        const safe = { id: user.id, email: user.email, role: user.role, name: user.name };

        // sign token and set cookie
        const token = signToken(safe);
        const cookie = serializeCookie(token);

        return new Response(JSON.stringify({ ok: true, user: safe }), { status: 200, headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookie } });

    } catch (error) {
        console.error('LOGIN ERROR', error);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
