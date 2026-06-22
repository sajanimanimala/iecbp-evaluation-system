import { prisma } from "../../lib/prisma.js";

function convertToScore(count) {
    if (count >= 5) return 5;
    else if (count >= 4) return 4;
    else if (count >= 3) return 3;
    else if (count >= 2) return 2;
    else return 1;
}

export async function generateSignals(submissionId) {
    if (!submissionId || Number.isNaN(Number(submissionId))) {
        throw new Error("Invalid submissionId provided to generateSignals");
    }

    // Fetch all evidence records for this submission
    const evidenceRecords = await prisma.evidence.findMany({
        where: {
            responseId: {
                in: (
                    await prisma.answer.findMany({
                        where: { submissionId: Number(submissionId) },
                        select: { id: true }
                    })
                ).map(a => a.id)
            }
        }
    });

    // Count evidence by type
    const counts = {
        causeCount: 0,
        decisionCount: 0,
        riskCount: 0,
        stakeholderCount: 0,
        actionCount: 0
    };

    for (const evidence of evidenceRecords) {
        switch (evidence.type) {
            case "CAUSE":
                counts.causeCount += 1;
                break;
            case "DECISION":
                counts.decisionCount += 1;
                break;
            case "RISK":
                counts.riskCount += 1;
                break;
            case "STAKEHOLDER":
                counts.stakeholderCount += 1;
                break;
            case "ACTION":
                counts.actionCount += 1;
                break;
        }
    }

    // Fetch all answers for clarity calculation (word count)
    const answers = await prisma.answer.findMany({
        where: { submissionId: Number(submissionId) }
    });

    let totalWordCount = 0;
    for (const answer of answers) {
        if (answer.answer) {
            const words = answer.answer.trim().split(/\s+/).filter(w => w.length > 0);
            totalWordCount += words.length;
        }
    }

    // Generate signals based on evidence counts
    const understanding = convertToScore(counts.causeCount + counts.stakeholderCount);
    const awareness = convertToScore(counts.riskCount + counts.stakeholderCount);
    const decision = convertToScore(counts.decisionCount);
    const actionability = convertToScore(counts.actionCount);
    const clarity = convertToScore(Math.floor(totalWordCount / 50)); // Rough heuristic: 50 words per point

    const signals = {
        understanding,
        awareness,
        decision,
        actionability,
        clarity
    };

    console.log("SIGNALS:", signals);

    return signals;
}
