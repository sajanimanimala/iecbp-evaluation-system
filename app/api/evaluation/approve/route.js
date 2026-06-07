export async function POST(request) {
    const body = await request.json();
    return new Response(JSON.stringify({ ok: true, approvedId: body.id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
