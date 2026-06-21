import { prisma } from "../../lib/prisma.js";

export const EVIDENCE_KEYWORDS = {
    CAUSE: [
        "because",
        "due to",
        "therefore",
        "hence",
        "root cause",
        "dependency"
    ],

    DECISION: [
        "choose",
        "prioritize",
        "recommend",
        "should",
        "must",
        "select"
    ],

    RISK: [
        "risk",
        "impact",
        "issue",
        "challenge",
        "blocker",
        "threat"
    ],

    STAKEHOLDER: [
        "stakeholder",
        "team",
        "customer",
        "client",
        "manager",
        "user"
    ],

    ACTION: [
        "implement",
        "execute",
        "monitor",
        "track",
        "review",
        "assign"
    ]
};

export async function extractEvidence(submissionId) {
    if (!submissionId || Number.isNaN(Number(submissionId))) {
        throw new Error("Invalid submissionId provided to extractEvidence");
    }

    const answers = await prisma.answer.findMany({
        where: { submissionId: Number(submissionId) }
    });

    const evidenceRecords = [];
    const counts = {
        causeCount: 0,
        decisionCount: 0,
        riskCount: 0,
        stakeholderCount: 0,
        actionCount: 0
    };

    for (const answer of answers) {
        const originalText = answer.answer || "";
        const normalizedText = originalText.toLowerCase();

        for (const [type, keywords] of Object.entries(EVIDENCE_KEYWORDS)) {
            for (const keyword of keywords) {
                if (keyword && normalizedText.includes(keyword)) {
                    const record = {
                        responseId: answer.id,
                        type,
                        keyword,
                        sentence: originalText
                    };

                    evidenceRecords.push(record);

                    switch (type) {
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
            }
        }
    }

    if (evidenceRecords.length > 0) {
        await prisma.evidence.createMany({
            data: evidenceRecords
        });
    }

    return counts;
}
