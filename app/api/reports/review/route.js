const { parseCookies, verifyToken } = require('../../../../lib/session');
const { PrismaClient } = require('@prisma/client');
const resend = require('../../../../lib/resend');

const prisma = new PrismaClient();

async function sendApprovalEmailToCandidate(report) {
  const submissionId = Number(report?.submissionId);
  if (!submissionId) {
    throw new Error('Submission ID is missing');
  }

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      candidate: {
        include: {
          user: true,
        },
      },
    },
  });

  const scenario = await prisma.scenario.findUnique({
    where: { id: submission?.scenarioId },
  });

  const candidateName = submission?.candidate?.name || submission?.candidate?.user?.name || 'there';
  const candidateEmail = submission?.candidate?.user?.email;
  const scenarioName = scenario?.title || 'IECBP Engineering Capability Evaluation';

  if (!candidateEmail) {
    throw new Error('Candidate email is missing');
  }

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="color: #1d4ed8;">IECBP Evaluation Report Available</h2>
      <p>Dear ${candidateName},</p>
      <p>We are pleased to inform you that your submission for the IECBP Engineering Capability Evaluation has been successfully reviewed by the evaluation panel.</p>
      <p>Your evaluation report has now been published and is available for viewing within the IECBP Evaluation System.</p>
      <p><strong>Assessment Details:</strong></p>
      <ul>
        <li><strong>Scenario:</strong> ${scenarioName}</li>
        <li><strong>Submission ID:</strong> ${submissionId}</li>
        <li><strong>Evaluation Status:</strong> Approved</li>
        <li><strong>Report Status:</strong> Available</li>
      </ul>
      <p>Your report includes:</p>
      <ul>
        <li>Capability Assessment Results</li>
        <li>Engineering Capability Traits</li>
        <li>AI-Assisted Evaluation Insights</li>
        <li>Performance Feedback &amp; Recommendations</li>
      </ul>
      <p>Please log in to the system to review your complete evaluation report.</p>
      <p>Thank you for participating in the IECBP Evaluation Process.</p>
      <p>Best Regards,<br/>IECBP Evaluation System<br/>Engineering Capability Assessment Platform</p>
    </div>
  `;

  await resend.emails.send({
    from: 'IECBP <onboarding@resend.dev>',
    to: candidateEmail,
    subject: 'IECBP Evaluation Report Available',
    html,
  });

  return { sent: true, candidateEmail, candidateName, scenarioName, submissionId };
}

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

    console.log('APPROVAL SAVED', { reportId: updated.id, status: updated.status, submissionId: updated.submissionId });

    if (normalized === 'APPROVE') {
      try {
        console.log('CANDIDATE EMAIL STARTED', { reportId: updated.id, submissionId: updated.submissionId });
        const emailResult = await sendApprovalEmailToCandidate(updated);
        console.log('CANDIDATE EMAIL SENT', emailResult);
      } catch (emailError) {
        console.error('CANDIDATE EMAIL FAILED', {
          reportId: updated.id,
          submissionId: updated.submissionId,
          message: emailError.message,
        });
      }
    }

    return new Response(JSON.stringify({ success: true, report: updated }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('REPORT REVIEW ERROR:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
