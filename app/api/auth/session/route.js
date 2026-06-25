export async function GET(req) {
    try {
        const cookieHeader = req.headers.get('cookie');

        console.log("SESSION COOKIE HEADER:", cookieHeader);

        const cookies = parseCookies(cookieHeader);

        console.log("PARSED COOKIES:", cookies);

        const token = cookies['iecbp_session'];

        console.log("SESSION TOKEN:", token);

        if (!token) {
            console.log("NO TOKEN FOUND");
            return new Response(
                JSON.stringify({ ok: false }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const payload = verifyToken(token);

        console.log("SESSION PAYLOAD:", payload);

        return new Response(
            JSON.stringify({ ok: true, user: payload }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error("SESSION ERROR:", error);
        return new Response(
            JSON.stringify({ ok: false }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}