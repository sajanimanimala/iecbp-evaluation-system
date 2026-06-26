import { cookies } from 'next/headers';
const { verifyToken } = require('../../../../lib/session');

export async function GET() {
  try {
    const cookieStore = await cookies();

    console.log('[TRACE] session route cookies', cookieStore.getAll());

    const token =
      cookieStore.get('iecbp_session')?.value;

    console.log('[TRACE] session route token present', Boolean(token));
    console.log('[TRACE] session route token value', token);

    if (!token) {
      console.log('[TRACE] session route -> 401', { reason: 'no token found' });
      return Response.json(
        { ok: false },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    console.log('[TRACE] session route payload', payload);

    console.log('[TRACE] session route -> 200', { user: payload });
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