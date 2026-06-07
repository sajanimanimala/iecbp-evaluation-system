// Client-side auth helpers (localStorage based)
export const AUTH_KEY = 'iecbp_auth_user_v1';

export function setAuthUser(user) {
    if (!user) return;
    try { localStorage.setItem(AUTH_KEY, JSON.stringify(user)); } catch (e) { /* ignore */ }
}

export function getAuthUser() {
    try {
        const raw = localStorage.getItem(AUTH_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) { return null; }
}

export function clearAuthUser() {
    try { localStorage.removeItem(AUTH_KEY); } catch (e) { }
}

export function isAuthenticated() {
    return !!getAuthUser();
}

export function hasRole(role) {
    const u = getAuthUser();
    if (!u || !u.role) return false;
    return u.role === role;
}

export function redirectPathForRole(role) {
    switch (role) {
        case 'ADMIN': return '/dashboard/admin';
        case 'EVALUATOR': return '/dashboard/evaluator';
        case 'CANDIDATE': return '/dashboard/candidate';
        default: return '/';
    }
}

export async function fetchSession() {
    try {
        const res = await fetch('/api/auth/session');
        if (!res.ok) return null;
        const data = await res.json();
        if (data?.ok && data.user) {
            try { setAuthUser(data.user); } catch (e) { }
            return data.user;
        }
        return null;
    } catch (e) { return null; }
}

export async function logout() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) { }
    clearAuthUser();
}
