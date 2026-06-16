const { PrismaClient } = require('@prisma/client');
const { parseCookies, verifyToken } = require('../../../../lib/session');

const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
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

        const notificationId = params.id;

        if (!notificationId) {
            return new Response(JSON.stringify({ message: 'Notification ID is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const notification = await prisma.notification.findUnique({
            where: { id: Number(notificationId) },
        });

        if (!notification) {
            return new Response(JSON.stringify({ message: 'Notification not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        if (notification.userId !== payload.id) {
            return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        const updated = await prisma.notification.update({
            where: { id: Number(notificationId) },
            data: { isRead: true },
        });

        return new Response(JSON.stringify(updated), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('UPDATE NOTIFICATION ERROR', error);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
