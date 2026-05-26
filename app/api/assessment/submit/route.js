import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json();
        const { attemptId } = body;

        if (!attemptId) {
            return Response.json(
                {
                    success: false,
                    message: "Attempt ID missing.",
                },
                { status: 400 }
            );
        }

        const examAttempt = await prisma.examAttempt.findUnique({
            where: {
                id: attemptId,
            },
        });

        if (!examAttempt) {
            return Response.json(
                {
                    success: false,
                    message: "Exam attempt not found.",
                },
                { status: 404 }
            );
        }

        const submitTime = new Date();
        const startTime = new Date(examAttempt.start_time);

        const durationMinutes =
            (submitTime - startTime) / 1000 / 60;

        if (durationMinutes < 10) {
            return Response.json({
                success: false,
                tooFast: true,
                message: "Assessment completed unusually quickly.",
            });
        }
        await prisma.examAttempt.update({
            where: {
                id: attemptId,
            },
            data: {
                submit_time: submitTime,
                duration_minutes: durationMinutes,
                status: "submitted",
            },
        });

        return Response.json({
            success: true,
            message: "Timing validation passed.",
        });

    } catch (error) {
        console.error("Submit error:", error);

        return Response.json(
            {
                success: false,
                message: "Failed to submit assessment.",
            },
            { status: 500 }
        );
    }
}