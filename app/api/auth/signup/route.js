const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const { signToken, serializeCookie } = require('../../../../lib/session');

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email: rawEmail, password } = body;
        const email = (rawEmail || '').trim().toLowerCase();

        if (!email || !password) {
            return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // basic validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(JSON.stringify({ message: 'Invalid email' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        if (password.length < 8) {
            return new Response(JSON.stringify({ message: 'Password must be at least 8 characters' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // duplicate email
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return new Response(JSON.stringify({ message: 'Email already in use' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
        }

        // hash password
        const saltRounds = 10;
        const hashed = await bcrypt.hash(password, saltRounds);

        const user = await prisma.user.create({
            data: {
                name: name || null,
                email,
                password: hashed,
                role: 'CANDIDATE',
            }
        });

        // sign token and set cookie
        const safe = { id: user.id, email: user.email, role: user.role, name: user.name };
        const token = signToken(safe);
        const cookie = serializeCookie(token);

        // return safe response with cookie
        return new Response(JSON.stringify({ ok: true, user: safe }), { status: 201, headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookie } });

    } catch (error) {
        console.error('SIGNUP ERROR', error);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
