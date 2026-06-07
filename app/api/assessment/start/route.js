import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {

  try {

    const body = await req.json().catch(() => ({}));


    const examAttempt = await prisma.examAttempt.create({
      data: {



        start_time: new Date(),

        status: "started"
      },
    });

    console.log("ATTEMPT CREATED:", examAttempt);

    return Response.json({
      success: true,
      attemptId: examAttempt.id,
      startTime: examAttempt.start_time,
    });

  } catch (error) {

    console.error("START API ERROR:", error);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500
      }
    );
  }
}