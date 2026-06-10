const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const questionBanks = {
  1: require('../../../../../data/scenario1Questions').scenario1Questions,
  2: require('../../../../../data/scenario2Questions').scenario2Questions,
  3: require('../../../../../data/scenario3Questions').scenario3Questions,
  4: require('../../../../../data/scenario4Questions').scenario4Questions,
  5: require('../../../../../data/scenario5Questions').scenario5Questions,
  6: require('../../../../../data/scenario6Questions').scenario6Questions,
};

function parseAnswer(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'string') return parsed;
    return JSON.stringify(parsed);
  } catch (e) {
    return raw;
  }
}

export async function GET(req) {
  try {
    const pathname = req.nextUrl?.pathname || new URL(req.url, 'http://localhost').pathname;
    const parts = pathname.split('/').filter(Boolean);
    const submissionId = Number(parts.at(-1));

    if (Number.isNaN(submissionId) || submissionId <= 0) {
      return Response.json({ success: false, message: 'Invalid submission ID' }, { status: 400 });
    }

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        candidate: true,
        attempt: {
          include: {
            candidate: true,
          },
        },
      },
    });

    if (!submission) {
      return Response.json({ success: false, message: 'Submission not found' }, { status: 404 });
    }

    const answers = await prisma.answer.findMany({
      where: { submissionId },
      orderBy: { questionId: 'asc' },
    });

    const evaluationResult = await prisma.evaluationResult.findFirst({
      where: { submissionId },
      orderBy: { id: 'desc' },
    });

    const questionBank = questionBanks[submission.scenarioId] || [];
    const questions = answers.map(answer => {
      const bankQuestion = questionBank.find(q => Number(q.id) === Number(answer.questionId));
      return {
        id: answer.questionId,
        question: bankQuestion?.question || `Question ${answer.questionId}`,
        answer: parseAnswer(answer.answer),
        type: bankQuestion?.type || 'text',
      };
    });

    return Response.json({
      success: true,
      submission: {
        id: submission.id,
        candidateCode: submission.candidate?.candidate_code || submission.attempt?.candidate?.candidate_code || 'Unknown',
        scenarioId: submission.scenarioId,
        scenario: `Scenario ${submission.scenarioId}`,
        date: submission.submittedAt,
        status: 'pending',
        questions,
        ai: evaluationResult ? {
          overall: evaluationResult.overallScore,
          understanding: evaluationResult.understanding,
          awareness: evaluationResult.awareness,
          decision: evaluationResult.decision,
          clarity: evaluationResult.clarity,
        } : null,
      },
    });
  } catch (error) {
    console.error('EVALUATOR SUBMISSION DETAIL ERROR:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
