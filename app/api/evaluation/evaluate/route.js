const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const {
  evaluateSubmission
} = require('../../../../evaluation/evaluationEngine');

export async function POST(req) {

  try {

    const body = await req.json();

    const { submissionId, scenarioId } = body;

    // STEP 1 — fetch answers from DB
    const dbAnswers = await prisma.answer.findMany({
      where: {
        submissionId
      }
    });

    console.log("DB ANSWERS:", dbAnswers);

    const { extractEvidence } = await import('../../../services/evidenceService.js');
    const evidenceSummary = await extractEvidence(submissionId);
    console.log("EVIDENCE SUMMARY:", evidenceSummary);

    const { generateSignals } = await import('../../../services/signalService.js');
    const signals = await generateSignals(submissionId);

    // STEP 2 — format answers for engine
    const formattedAnswers = dbAnswers.map((a) => ({
      questionId: `q${a.questionId}`,
      answer: a.answer
    }));
    console.log("FORMATTED:", formattedAnswers);

    // STEP 3 — run evaluation engine
    const result = await evaluateSubmission(
      scenarioId,
      formattedAnswers
    );

    console.log("EVALUATION RESULT:", result);

    const totalEvidenceCount =
      evidenceSummary.causeCount +
      evidenceSummary.decisionCount +
      evidenceSummary.riskCount +
      evidenceSummary.stakeholderCount +
      evidenceSummary.actionCount;

    const capabilityIndex =
      (signals.understanding + signals.awareness + signals.decision + signals.actionability + signals.clarity) / 5;
    const confidenceIndex =
      (signals.decision + signals.actionability) / 2;
    const coverageIndex =
      Math.min(5, Math.max(1, 1 + totalEvidenceCount / 2));

    // STEP 4 — store evaluation result
    const saved =
      await prisma.evaluation.create({
        data: {
          responseId: Number(submissionId),
          understanding: signals.understanding,
          clarity: signals.clarity,
          awareness: signals.awareness,
          decision: signals.decision,
          actionability: signals.actionability,
          capabilityIndex,
          confidenceIndex,
          coverageIndex
        }
      });

    console.log("EVALUATION SAVED:", saved);

    return Response.json({
      success: true,
      result: saved
    });

  } catch (error) {

    console.log("EVALUATION ERROR:", error);

    return Response.json({
      success: false,
      error: error.message
    });
  }
}