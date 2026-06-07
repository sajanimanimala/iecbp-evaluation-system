const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'iecbp_session';
const TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days
const TOKEN_EXPIRY = `${TOKEN_EXPIRY_SECONDS}s`;

const SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'dev_secret_change_me';

function signToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: TOKEN_EXPIRY_SECONDS });
}

function verifyToken(token) {
    return jwt.verify(token, SECRET);
}

function serializeCookie(token) {
    const parts = [];
    parts.push(`${COOKIE_NAME}=${token}`);
    parts.push(`Path=/`);
    parts.push(`Max-Age=${TOKEN_EXPIRY_SECONDS}`);
    parts.push(`HttpOnly`);
    parts.push(`SameSite=Lax`);
    if (process.env.NODE_ENV === 'production') parts.push('Secure');
    return parts.join('; ');
}

function clearCookie() {
    const parts = [];
    parts.push(`${COOKIE_NAME}=;`);
    parts.push(`Path=/`);
    parts.push(`Max-Age=0`);
    parts.push(`HttpOnly`);
    parts.push(`SameSite=Lax`);
    if (process.env.NODE_ENV === 'production') parts.push('Secure');
    return parts.join('; ');
}

function parseCookies(cookieHeader) {
    const map = {};
    if (!cookieHeader) return map;
    const parts = cookieHeader.split(';');
    for (const p of parts) {
        const idx = p.indexOf('=');
        if (idx === -1) continue;
        const key = p.slice(0, idx).trim();
        const val = p.slice(idx + 1).trim();
        map[key] = val;
    }
    return map;
}

module.exports = {
    COOKIE_NAME,
    signToken,
    verifyToken,
    serializeCookie,
    clearCookie,
    parseCookies,
};
