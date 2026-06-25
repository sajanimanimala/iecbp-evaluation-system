import { prisma } from './prisma';

/**
 * Get the number of submission attempts for a candidate on a scenario.
 * Counts rows in the Submission table where candidateId and scenarioId match.
 *
 * @param {number|string} candidateId
 * @param {number|string} scenarioId
 * @returns {Promise<{scenarioId:number,candidateId:number,attemptCount:number}>}
 */
export async function getSubmissionAttemptCount(candidateId, scenarioId) {
    const cand = Number(candidateId);
    const scen = Number(scenarioId);

    if (!Number.isFinite(cand) || !Number.isFinite(scen)) {
        return {
            scenarioId: scen || null,
            candidateId: cand || null,
            attemptCount: 0,
        };
    }

    const attemptCount = await prisma.submission.count({
        where: {
            candidateId: cand,
            scenarioId: scen,
        },
    });

    return {
        scenarioId: scen,
        candidateId: cand,
        attemptCount: Number(attemptCount || 0),
    };
}

export default getSubmissionAttemptCount;
