import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { scenarioId, answers } = body;

    const submission = await prisma.submission.create({
      data: {
        scenarioId,
        submittedAt: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
        }),
      },
    });

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, answer]) => ({
        submissionId: submission.id,
        questionId: Number(questionId),
        answer:
          typeof answer === 'string'
            ? answer
            : JSON.stringify(answer),
      })
    );

    await prisma.answer.createMany({
      data: formattedAnswers,
    });

    return Response.json({
      success: true,
      submissionId: submission.id,
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: 'Failed to save submission',
      },
      { status: 500 }
    );
  }
}