const { parseCookies, verifyToken } = require('../../../../lib/session');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);
    const token = cookies['iecbp_session'];
    let reviewerId = null;

    if (!token) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    let payload;
    try {
      payload = verifyToken(token);
    } catch (error) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    if (!payload || payload.role !== 'EVALUATOR') {
      return new Response(JSON.stringify({ success: false, message: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    reviewerId = payload.id;

    const body = await request.json();
    const { reportId, action, evaluatorComment, modifiedReport } = body;

    if (!reportId || !action) {
      return new Response(JSON.stringify({ success: false, message: 'Missing reportId or action' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const normalized = String(action).toUpperCase();
    const validActions = ['APPROVE', 'MODIFY', 'REJECT'];
    if (!validActions.includes(normalized)) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid action' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const report = await prisma.evaluationReport.findUnique({ where: { id: Number(reportId) } });
    if (!report) {
      return new Response(JSON.stringify({ success: false, message: 'Report not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const now = new Date();
    let updateData = {
      status: normalized,
      reviewedAt: now,
      reviewedBy: reviewerId,
    };

    if (normalized === 'APPROVE') {
      updateData.evaluatorComment = evaluatorComment ?? report.evaluatorComment;
    }

    if (normalized === 'MODIFY') {
      if (!modifiedReport || typeof modifiedReport !== 'object') {
        return new Response(JSON.stringify({ success: false, message: 'Modified report payload is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      updateData.modifiedReport = modifiedReport;
      updateData.evaluatorComment = evaluatorComment ?? report.evaluatorComment;
    }

    if (normalized === 'REJECT') {
      if (!evaluatorComment || evaluatorComment.trim().length === 0) {
        return new Response(JSON.stringify({ success: false, message: 'Rejection reason is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      updateData.evaluatorComment = evaluatorComment;
    }

    const updated = await prisma.evaluationReport.update({ where: { id: Number(reportId) }, data: updateData });

    return new Response(JSON.stringify({ success: true, report: updated }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('REPORT REVIEW ERROR:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
