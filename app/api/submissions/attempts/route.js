import { NextResponse } from 'next/server';
import { getSubmissionAttemptCount } from '../../../../lib/submissionService';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const candidateId = searchParams.get('candidateId');
        const scenarioId = searchParams.get('scenarioId');

        if (!candidateId || !scenarioId) {
            return NextResponse.json({ error: 'candidateId and scenarioId required' }, { status: 400 });
        }

        const result = await getSubmissionAttemptCount(candidateId, scenarioId);
        return NextResponse.json(result);
    } catch (err) {
        console.error('Attempt count error', err);
        return NextResponse.json({ error: 'internal' }, { status: 500 });
    }
}
