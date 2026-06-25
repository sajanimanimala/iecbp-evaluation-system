const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const { signToken, serializeCookie, parseCookies } = require('../../../../lib/session');

export async function POST(req) {
    try {
        const body = await req.json();
        const { email: rawIdentifier, password } = body;
        const identifier = (rawIdentifier || '').trim().toLowerCase();

        if (!identifier || !password) {
            return new Response(JSON.stringify({ message: 'Email or Candidate Code and password are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        let user;
        const isEmail = identifier.includes('@');

        if (isEmail) {
            user = await prisma.user.findUnique({ where: { email: identifier } });
        } else {
            const candidate = await prisma.candidate.findUnique({ where: { candidate_code: identifier.toUpperCase() } });
            if (candidate && candidate.userId) {
                user = await prisma.user.findUnique({ where: { id: candidate.userId } });
            }
        }

        console.log("LOGIN EMAIL:", identifier);
        console.log("USER FOUND:", user);

        if (!user) {
            return new Response(JSON.stringify({ message: 'Invalid email, candidate code, or password' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
        console.log("Stored Hash:", user.password);
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return new Response(JSON.stringify({ message: 'Invalid email, candidate code, or password' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
        console.log("PASSWORD MATCH:", match);
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
