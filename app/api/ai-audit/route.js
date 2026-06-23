import { prisma } from '../../../lib/prisma.js';

export async function POST(req) {
    console.log('AI AUDIT API STARTED');

    try {
        const body = await req.json();
        const submissionId = body?.submissionId;

        if (submissionId === undefined || submissionId === null || Number.isNaN(Number(submissionId))) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid submissionId' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { auditEvidenceGaps } = await import('../../services/aiEvidenceAuditService.js');

        const result = await auditEvidenceGaps(Number(submissionId));

        if (!result || result.success === false) {
            const err = result?.error || 'AI audit failed';
            return new Response(JSON.stringify({ success: false, error: err }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Save to Prisma AIEvidenceAudit
        const saved = await prisma.aIEvidenceAudit.create({
            data: {
                submissionId: Number(submissionId),
                audit: {
                    missedEvidence: result.missedEvidence
                }
            }
        });

        console.log('AI AUDIT SAVED');
        console.log('AI AUDIT COMPLETED');

        return new Response(JSON.stringify({ success: true, submissionId: Number(submissionId), missedEvidence: result.missedEvidence }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('AI AUDIT ERROR:', error?.message || String(error));
        return new Response(JSON.stringify({ success: false, error: error?.message || String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}