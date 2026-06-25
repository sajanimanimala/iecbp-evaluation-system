import { cookies } from 'next/headers';
const { verifyToken } = require('../../../../lib/session');

export async function GET() {
  try {
    const cookieStore = await cookies();

    console.log("ALL COOKIES:",
      cookieStore.getAll()
    );

    const token =
      cookieStore.get('iecbp_session')?.value;

    console.log("SESSION TOKEN:", token);

    if (!token) {
      console.log("NO TOKEN FOUND");
      return Response.json(
        { ok: false },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    console.log("SESSION PAYLOAD:", payload);

    return Response.json({
      ok: true,
      user: payload
    });
  } catch (error) {
    console.error("SESSION ERROR:", error);
    console.error(error.message);

    return Response.json(
      { ok: false },
      { status: 401 }
    );
  }
}