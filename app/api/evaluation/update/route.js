export async function POST(request) {
    const body = await request.json();
    // mock: echo back
    return new Response(JSON.stringify({ ok: true, updated: body }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
