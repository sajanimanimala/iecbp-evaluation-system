const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json();
        const { token, newPassword, confirmPassword } = body;

        if (!token || !newPassword || !confirmPassword) {
            return new Response(JSON.stringify({ message: 'Token and passwords are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        if (newPassword.length < 8) {
            return new Response(JSON.stringify({ message: 'Password must be at least 8 characters' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        if (newPassword !== confirmPassword) {
            return new Response(JSON.stringify({ message: 'Passwords do not match' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const hashedResetToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await prisma.user.findFirst({
            where: {
                resetToken: hashedResetToken,
                resetTokenExpiry: { gt: new Date() },
            }
        });

        if (!user) {
            return new Response(JSON.stringify({ message: 'Invalid or expired reset link' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const saltRounds = 10;
        const hashed = await bcrypt.hash(newPassword, saltRounds);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashed,
                resetToken: null,
                resetTokenExpiry: null,
            }
        });

        return new Response(JSON.stringify({ ok: true, message: 'Password reset successfully. Please log in.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('RESET PASSWORD ERROR', error);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
