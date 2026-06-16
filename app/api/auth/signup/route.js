const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const resend = require('../../../../lib/resend');

const prisma = new PrismaClient();

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

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const user = await prisma.user.create({
            data: {
                name: name || null,
                email,
                password: hashed,
                role: 'CANDIDATE',
                isVerified: false,
                verificationToken: hashedVerificationToken,
                verificationTokenExpiry,
            }
        });

        await prisma.candidate.create({
            data: {
                userId: user.id,
                candidate_code:
                    `CAND${String(user.id).padStart(4, '0')}`,
                name: user.name || "Candidate",
            }
        });

        const displayName = user.name ? user.name : 'there';
        const verificationUrl = `http://localhost:3000/api/auth/verify?token=${verificationToken}`;
        const subject = 'Verify your IECBP Account';
        const html = `
            <p>Hi ${displayName},</p>
            <p>Thank you for registering with IECBP.</p>
            <p>Please verify your email by clicking the link below:</p>
            <p><a href="${verificationUrl}">Verify your email</a></p>
            <p>This link expires in 24 hours.</p>
            <p>If you did not register, you can ignore this email.</p>
        `;

        try {
            const { data, error } = await resend.emails.send({
                from: "IECBP <onboarding@resend.dev>",
                to: user.email,
                subject,
                html,
            });

            console.log("RESEND DATA:", data);
            console.log("RESEND ERROR:", error);
        } catch (err) {
            console.error("RESEND EXCEPTION:", err);
        }

        return new Response(JSON.stringify({ ok: true, message: 'Registration successful. Please verify your email.' }), { status: 201, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('SIGNUP ERROR', error);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
