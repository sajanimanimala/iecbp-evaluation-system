import { mockSubmissions } from '../../../../data/mockEvaluations';

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

export async function GET(req) {

  try {

    const { searchParams } =
      new URL(req.url);

    const submissionId =
      Number(searchParams.get('submissionId'));

    const result =
      await prisma.evaluationResult.findFirst({
        where: {
          submissionId
        },

        orderBy: {
          id: 'desc'
        }
      });

    return Response.json({
      success: true,
      result
    });

  } catch (error) {

    console.log(error);

    return Response.json({
      success: false,
      error: error.message
    });
  }
}