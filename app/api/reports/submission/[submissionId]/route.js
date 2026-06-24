import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const pathname = req.nextUrl?.pathname || new URL(req.url, 'http://localhost').pathname;
    const parts = pathname.split('/').filter(Boolean);
    const submissionId = Number(parts.at(-1));

    if (Number.isNaN(submissionId) || submissionId <= 0) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid submission ID' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const report = await prisma.evaluationReport.findFirst({
      where: { submissionId },
      orderBy: { id: 'desc' }
    });

    if (!report) {
      return new Response(JSON.stringify({ success: false, message: 'Report not found', report: null }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true, report }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('REPORT FETCH ERROR:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
