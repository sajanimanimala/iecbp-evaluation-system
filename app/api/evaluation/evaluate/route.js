const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const {
  evaluateSubmission
} = require('../../../../evaluation/evaluationEngine');

export async function POST(req) {

  try {

    const body = await req.json();

    const { submissionId, scenarioId } = body;

    // STEP 1 — fetch submission and answers from DB
    const submission = await prisma.submission.findUnique({
      where: { id: Number(submissionId) }
    });

    const dbAnswers = await prisma.answer.findMany({
      where: {
        submissionId
      }
    });

    const attemptId = submission?.attemptId ?? null;

    console.log("DB ANSWERS:", dbAnswers);

    const { extractEvidence } = await import('../../../services/evidenceService.js');
    const evidenceSummary = await extractEvidence(submissionId);
    console.log("EVIDENCE SUMMARY:", evidenceSummary);

    const evidenceRecords = await prisma.evidence.findMany({
      where: {
        responseId: { in: dbAnswers.map((a) => a.id) }
      }
    });

    const evidenceByQuestionId = new Map();
    for (const answer of dbAnswers) {
      evidenceByQuestionId.set(answer.questionId, []);
    }
    for (const record of evidenceRecords) {
      const answer = dbAnswers.find((a) => a.id === record.responseId);
      if (!answer) continue;
      const items = evidenceByQuestionId.get(answer.questionId) || [];
      items.push({ type: record.type, keyword: record.keyword, sentence: record.sentence });
      evidenceByQuestionId.set(answer.questionId, items);
    }

    const { generateSignals } = await import('../../../services/signalService.js');
    const signals = await generateSignals(submissionId);
    console.log("SIGNALS:", signals);

    const { calculateScores } = await import('../../../services/scoringService.js');
    const scores = calculateScores({
      understanding: signals.understanding,
      awareness: signals.awareness,
      decision: signals.decision,
      actionability: signals.actionability,
      clarity: signals.clarity,
      evidenceCounts: evidenceSummary
    });

    console.log("EVIDENCE COUNTS:", evidenceSummary);
    console.log("FINAL INDICES:", scores);

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
          capabilityIndex: scores.capabilityIndex,
          confidenceIndex: scores.confidenceIndex,
          coverageIndex: scores.coverageIndex
        }
      });

    const questionScoreData = result.evaluatedQuestions.map((question) => {
      const questionNum = Number(String(question.questionId).replace(/^q/, ''));
      const answerForQuestion = dbAnswers.find((a) => a.questionId === questionNum);
      const questionEvidence = evidenceByQuestionId.get(questionNum) || [];
      const answerText = typeof question.rawAnswer === 'string'
        ? question.rawAnswer
        : JSON.stringify(question.rawAnswer);
      const clarityEvidence = [{
        wordCount: answerText.trim().split(/\s+/).filter(Boolean).length,
        excerpt: answerText.slice(0, 120)
      }];

      return {
        submissionId: Number(submissionId),
        attemptId,
        questionId: questionNum,
        score: question.score,
        understandingEvidence: questionEvidence.filter((item) => item.type === 'CAUSE' || item.type === 'STAKEHOLDER'),
        awarenessEvidence: questionEvidence.filter((item) => item.type === 'RISK' || item.type === 'STAKEHOLDER'),
        decisionEvidence: questionEvidence.filter((item) => item.type === 'DECISION'),
        actionabilityEvidence: questionEvidence.filter((item) => item.type === 'ACTION'),
        clarityEvidence,
      };
    });

    await prisma.questionScore.deleteMany({
      where: { submissionId: Number(submissionId) }
    });

    await prisma.questionScore.createMany({
      data: questionScoreData
    });

    console.log("QUESTION SCORES SAVED:", questionScoreData.length);

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