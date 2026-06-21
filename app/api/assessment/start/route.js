import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import {
  verifyToken,
  COOKIE_NAME
} from '../../../../lib/session';

const prisma = new PrismaClient();

export async function POST(req) {

  try {

    const cookieStore = await cookies();

    const token =
      cookieStore.get('iecbp_session')?.value;

    if (!token) {

      return Response.json(
        {
          success: false,
          message: "Not authenticated",
        },
        {
          status: 401,
        }
      );
    }

    const session = verifyToken(token);

    const candidate =
      await prisma.candidate.findFirst({
        where: {
          userId: session.id,
        },
      });

    if (!candidate) {

      return Response.json(
        {
          success: false,
          message: "Candidate not found",
        },
        {
          status: 404,
        }
      );
    }

    const examAttempt =
      await prisma.examAttempt.create({
        data: {

          userId: session.id,

          candidateId: candidate.id,

          start_time: new Date(),

          status: "started",
        },
      });

    console.log(
      "ATTEMPT CREATED:",
      examAttempt
    );

    const responsePayload = {
      success: true,
      attemptId: examAttempt.id,
      startTime: examAttempt.start_time,
    };

    console.log("START API RETURNING:", responsePayload);

    return Response.json(responsePayload);

  } catch (error) {

    console.error(
      "START API ERROR:",
      error
    );

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500
      }
    );
  }
}