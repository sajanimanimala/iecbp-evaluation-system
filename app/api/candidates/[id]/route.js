import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    try {
        const userId = params.id;
        if (!userId) {
            return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const candidate = await prisma.candidate.findUnique({
            where: { userId: parseInt(userId) },
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
