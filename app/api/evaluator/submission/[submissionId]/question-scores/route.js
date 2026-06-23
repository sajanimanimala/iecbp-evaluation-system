const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const pathname = req.nextUrl?.pathname || new URL(req.url, 'http://localhost').pathname;
    const parts = pathname.split('/').filter(Boolean);
    const submissionId = Number(parts.at(-2));

    if (Number.isNaN(submissionId) || submissionId <= 0) {
      return Response.json({ success: false, message: 'Invalid submission ID' }, { status: 400 });
    }

    const questionScores = await prisma.questionScore.findMany({
      where: { submissionId },
      orderBy: { questionId: 'asc' }
    });

    const questionIds = questionScores.map((score) => score.questionId);
    const questions = await prisma.question.findMany({
      where: { id: { in: questionIds } }
    });

    const questionsById = new Map(questions.map((q) => [q.id, q.questionText]));

    // FETCH: AI Missed Evidence from AIEvidenceAudit
    const aiAudit = await prisma.aIEvidenceAudit.findFirst({
      where: { submissionId },
      orderBy: { id: 'desc' }
    });

    let allAiMissedEvidence = [];
    if (aiAudit) {
      console.log('AI AUDIT RECORD FOUND');
      const missedEvidence = aiAudit.audit?.missedEvidence || [];
      allAiMissedEvidence = Array.isArray(missedEvidence) ? missedEvidence : [];
      console.log('AI MISSED EVIDENCE COUNT:', allAiMissedEvidence.length);
    }

    const questionScoresWithText = questionScores.map((score) => {
      // Match AI missed evidence to this question by questionId
      const questionAiMissedEvidence = allAiMissedEvidence.filter(
        item => Number(item.questionId) === Number(score.questionId)
      );

      if (questionAiMissedEvidence.length > 0) {
        console.log('QUESTION AI EVIDENCE ATTACHED');
      }

      return {
        ...score,
        questionText: questionsById.get(score.questionId) || `Question ${score.questionId}`,
        aiMissedEvidence: questionAiMissedEvidence
      };
    });

    return Response.json({ success: true, questionScores: questionScoresWithText });
  } catch (error) {
    console.error('QUESTION SCORES API ERROR:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
