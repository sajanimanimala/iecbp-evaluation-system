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
    const evaluationResults = await prisma.evaluationResult.findMany({
      where: {
        submissionId: { in: submissionIds },
      },
    });
    const resultBySubmission = new Map(
      evaluationResults.map(result => [result.submissionId, result])
    );

    const payload = submissions.map(submission => {
      const result = resultBySubmission.get(submission.id);
      return {
        id: submission.id,
        candidateCode: submission.candidate?.candidate_code || submission.attempt?.candidate?.candidate_code || 'Unknown',
        scenario: scenarioNames[submission.scenarioId] || `Scenario ${submission.scenarioId}`,
        date: submission.submittedAt,
        status: 'pending',
        aiScore: result?.overallScore ?? 0,
      };
    });

    return Response.json({ success: true, submissions: payload });
  } catch (error) {
    console.error('EVALUATOR SUBMISSIONS ERROR:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
