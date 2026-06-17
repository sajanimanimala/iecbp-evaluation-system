const { PrismaClient } = require('@prisma/client');
const { parseCookies, verifyToken } = require('../../../../lib/session');

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        // Verify authentication
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

        const userId = payload.id;

        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        // Only CANDIDATE role users can delete their own account
        if (user.role !== 'CANDIDATE') {
            return new Response(JSON.stringify({ message: 'Only candidates can delete their account' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
        }

        // Delete all notifications for this user
        await prisma.notification.deleteMany({
            where: { userId }
        });

        // Delete all submissions for this user's candidate
        const candidate = await prisma.candidate.findUnique({
            where: { userId }
        });

        if (candidate) {
            // Delete submissions
            await prisma.submission.deleteMany({
                where: { candidateId: candidate.id }
            });

            // Delete candidate
            await prisma.candidate.delete({
                where: { id: candidate.id }
            });
        }

        // Delete user
        await prisma.user.delete({
            where: { id: userId }
        });

        // Return success response with instruction to clear session
        return new Response(
            JSON.stringify({
                ok: true,
                message: 'Account deleted successfully. You will be logged out.',
                clearSession: true
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Set-Cookie': 'iecbp_session=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict'
                }
            }
        );

    } catch (error) {
        console.error('DELETE ACCOUNT ERROR', error);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
