// app/api/submissions/route.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

console.log("SUBMISSION API HIT");
export async function POST(req) {

  try {

    const body = await req.json();

    const {
      scenarioId,
      answers,
      attemptId
    } = body;

    // ─────────────────────────────────────
    // STEP 1 — Create submission
    // ─────────────────────────────────────

    if (!attemptId) {
      return Response.json({
        success: false,
        message: 'Attempt ID is required',
      }, {
        status: 400,
      });
    }

    const attempt = await prisma.examAttempt.findUnique({
      where: {
        id: Number(attemptId),
      },
    });

    if (!attempt) {
      return Response.json({
        success: false,
        message: 'Exam attempt not found',
      }, {
        status: 404,
      });
    }

    const existingSubmission = await prisma.submission.findFirst({
      where: {
        attemptId: Number(attemptId),
        scenarioId,
      },
    });

    if (existingSubmission) {
      return Response.json({
        success: true,
        duplicatePrevented: true,
        submissionId: existingSubmission.id,
      });
    }

    const candidateId = attempt.candidateId ? Number(attempt.candidateId) : null;

    const submission = await prisma.submission.create({
      data: {
        scenarioId,
        attemptId: Number(attemptId),
        candidateId,
        submittedAt: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
        }),
      },
    });

    // ─────────────────────────────────────
    // STEP 2 — Format answers
    // ─────────────────────────────────────

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

    // ─────────────────────────────────────
    // STEP 3 — Store answers
    // ─────────────────────────────────────

    await prisma.answer.createMany({
      data: formattedAnswers,
    });

    console.log("ANSWERS STORED");

    // ─────────────────────────────────────
    // UPDATE EXAM ATTEMPT
    // ─────────────────────────────────────

    if (attemptId !== undefined && attemptId !== null) {

      const attempt =
        await prisma.examAttempt.findUnique({
          where: {
            id: Number(attemptId),
          },
        });

      if (attempt) {

        const startTime =
          new Date(attempt.start_time);

        const endTime =
          new Date();

        const duration_minutes =
          Math.max(
            1,
            Math.round(
              (endTime - startTime) / 60000
            )
          );

        await prisma.examAttempt.update({
          where: {
            id: Number(attemptId),
          },

          data: {
            status: 'submitted',

            submit_time: new Date(),

            duration_minutes: Number(duration_minutes),
          },
        });

        console.log("EXAM ATTEMPT UPDATED");
      }
    }

    // ─────────────────────────────────────
    // STEP 4 — Trigger evaluation engine
    // ─────────────────────────────────────

    const evaluationResponse = await fetch(
      'http://localhost:3000/api/evaluation/evaluate',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          submissionId: submission.id,
          scenarioId,
        }),
      }
    );

    const evaluationData =
      await evaluationResponse.json();

    console.log(
      "EVALUATION RESPONSE:",
      evaluationData
    );

    // ─────────────────────────────────────
    // STEP 5 — Return success
    // ─────────────────────────────────────

    return Response.json({
      success: true,

      submissionId: submission.id,

      evaluation: evaluationData,
    });

  } catch (error) {

    console.error(
      "SUBMISSION ERROR:",
      error
    );

    return Response.json(
      {
        success: false,

        message:
          'Failed to save submission',
      },
      {
        status: 500,
      }
    );
  }
}