import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
    try {
        const examAttempt = await prisma.examAttempt.create({
            data: {
                status: "started"
            },
        });

        return Response.json({
            success: true,
            attemptId: examAttempt.id,
            startTime: examAttempt.start_time,
        });

    } catch (error) {
        console.error("START API ERROR:", error);

        return Response.json({
            success: false,
            message: error.message,
        }, {
            status: 500
        });
    }
}