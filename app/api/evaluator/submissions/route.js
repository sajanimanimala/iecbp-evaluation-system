const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const scenarioNames = {
  1: 'Scenario 1',
  2: 'Scenario 2',
  3: 'Scenario 3',
  4: 'Scenario 4',
  5: 'Scenario 5',
  6: 'Scenario 6',
};

export async function GET() {
  try {
    const submissions = await prisma.submission.findMany({
      orderBy: {
        submittedAt: 'desc',
      },
      include: {
        candidate: true,
        attempt: true,
      },
    });

    const submissionIds = submissions.map(submission => submission.id);
    const evaluations = await prisma.evaluation.findMany({
      where: {
        responseId: { in: submissionIds },
      },
    });
    const evaluationBySubmission = new Map(
      evaluations.map(evaluation => [evaluation.responseId, evaluation])
    );

    const payload = submissions.map(submission => {
      const evaluation = evaluationBySubmission.get(submission.id);
      return {
        id: submission.id,
        candidateCode: submission.candidate?.candidate_code || submission.attempt?.candidate?.candidate_code || 'Unknown',
        scenario: scenarioNames[submission.scenarioId] || `Scenario ${submission.scenarioId}`,
        date: submission.submittedAt,
        status: 'pending',
        capabilityIndex: evaluation?.capabilityIndex ?? null,
        confidenceIndex: evaluation?.confidenceIndex ?? null,
        coverageIndex: evaluation?.coverageIndex ?? null,
      };
    });

    return Response.json({ success: true, submissions: payload });
  } catch (error) {
    console.error('EVALUATOR SUBMISSIONS ERROR:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
