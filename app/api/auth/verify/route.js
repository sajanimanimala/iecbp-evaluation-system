const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const { NextResponse } = require('next/server');

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        const token = request.nextUrl?.searchParams.get('token');
        if (!token) {
            return new Response(JSON.stringify({ message: 'Invalid verification link' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await prisma.user.findFirst({
            where: {
                verificationToken: hashedToken,
                verificationTokenExpiry: { gt: new Date() },
            }
        });

        if (!user) {
            return new Response(JSON.stringify({ message: 'Invalid or expired verification link' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationToken: null,
                verificationTokenExpiry: null,
            }
        });

        return NextResponse.redirect('http://localhost:3000/login?verified=true');

    } catch (error) {
        console.error('VERIFY ERROR', error);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
