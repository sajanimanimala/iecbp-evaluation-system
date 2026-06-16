const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { parseCookies, verifyToken } = require('../../../../lib/session');
const resend = require('../../../../lib/resend');
const { passwordChangedEmailTemplate } = require('../../../../lib/emailTemplates');

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const cookieHeader = req.headers.get('cookie');
        const cookies = parseCookies(cookieHeader);
        const token = cookies['iecbp_session'];
        if (!token) {
            return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        let payload;
        try {
            payload = verifyToken(token);
        } catch (error) {
            return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        const body = await req.json();
        const { currentPassword, newPassword, confirmPassword } = body;
        if (!currentPassword || !newPassword || !confirmPassword) {
            return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        if (newPassword.length < 8) {
            return new Response(JSON.stringify({ message: 'New password must be at least 8 characters' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        if (newPassword !== confirmPassword) {
            return new Response(JSON.stringify({ message: 'Passwords do not match' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const user = await prisma.user.findUnique({ where: { id: payload.id } });
        if (!user) {
            return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return new Response(JSON.stringify({ message: 'Current password is incorrect' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        const saltRounds = 10;
        const hashed = await bcrypt.hash(newPassword, saltRounds);
        await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

        try {
            const emailHtml = passwordChangedEmailTemplate(user.name || 'there');

            await resend.emails.send({
                from: 'IECBP <onboarding@resend.dev>',
                to: user.email,
                subject: 'Password Changed Successfully',
                html: emailHtml,
            });

            await prisma.notification.create({
                data: {
                    userId: user.id,
                    title: 'Password Updated',
                    message: 'Your password has been changed successfully.',
                    isRead: false,
                },
            });

            console.log("PASSWORD CHANGE EMAIL AND NOTIFICATION SENT");
        } catch (emailError) {
            console.error("ERROR SENDING PASSWORD CHANGE EMAIL:", emailError);
        }

        return new Response(JSON.stringify({ ok: true, message: 'Password changed successfully.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('CHANGE PASSWORD ERROR', error);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
