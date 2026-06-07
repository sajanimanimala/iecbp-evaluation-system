const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { parseCookies, verifyToken } = require('../../../../lib/session');

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        // Authenticate: require ADMIN
        const cookieHeader = req.headers.get('cookie');
        const cookies = parseCookies(cookieHeader);
        const token = cookies['iecbp_session'];
        if (!token) return new Response(JSON.stringify({ ok: false }), { status: 401, headers: { 'Content-Type': 'application/json' } });

        let payload;
        try {
            payload = verifyToken(token);
        } catch (e) {
            return new Response(JSON.stringify({ ok: false }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        if (!payload || payload.role !== 'ADMIN') {
            return new Response(JSON.stringify({ ok: false }), { status: 403, headers: { 'Content-Type': 'application/json' } });
        }

        // Total users
        const usersCount = await prisma.user.count();

        // Total responses/submissions
        const submissionsCount = await prisma.submission.count();

        // Total scenarios — infer by counting scenario pages or data files
        const assessmentDir = path.join(process.cwd(), 'app', 'assessment');
        let scenariosCount = 0;
        try {
            const items = fs.readdirSync(assessmentDir, { withFileTypes: true });
            scenariosCount = items.filter(i => i.isDirectory() && i.name.toLowerCase().startsWith('scenario')).length;
            // fallback: count files matching scenarioX in data folder
            if (scenariosCount === 0) {
                const dataDir = path.join(process.cwd(), 'data');
                const dataItems = fs.readdirSync(dataDir);
                scenariosCount = dataItems.filter(f => f.toLowerCase().includes('scenario') && f.toLowerCase().endsWith('.js')).length;
            }
        } catch (e) {
            // ignore and fallback to data folder
            try {
                const dataDir = path.join(process.cwd(), 'data');
                const dataItems = fs.readdirSync(dataDir);
                scenariosCount = dataItems.filter(f => f.toLowerCase().includes('scenario') && f.toLowerCase().endsWith('.js')).length;
            } catch (err) {
                scenariosCount = 0;
            }
        }

        return new Response(JSON.stringify({ ok: true, usersCount, submissionsCount, scenariosCount }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('admin stats error', error);
        return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
