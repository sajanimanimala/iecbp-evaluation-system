import { cookies } from 'next/headers';
const { verifyToken } = require('../../../../lib/session');

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('iecbp_session')?.value;

    if (!token) {
      return Response.json({ ok: false }, { status: 401 });
    }

    const payload = verifyToken(token);

    return Response.json({
      ok: true,
      user: payload
    });
  } catch (error) {
    console.error('SESSION ERROR:', error);

    return Response.json(
      { ok: false },
      { status: 401 }
    );
  }
}