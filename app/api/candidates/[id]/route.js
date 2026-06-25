import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    try {
        // Try to obtain id from params (may be a Promise) or from the request pathname
        const pathname = req.nextUrl?.pathname || new URL(req.url, 'http://localhost').pathname;
        const pathParts = pathname.split('/').filter(Boolean);
        const lastSegment = pathParts.at(-1);

        const maybeParam = params?.id ?? lastSegment;
        const rawId = maybeParam && typeof maybeParam.then === 'function' ? await maybeParam : maybeParam;
        const userId = rawId;

        if (!userId) {
            return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const candidate = await prisma.candidate.findUnique({
            where: { userId: parseInt(String(userId)) },
        });

        if (!candidate) {
            return new Response(JSON.stringify({ message: 'Candidate not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify(candidate), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('GET CANDIDATE ERROR', error);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
