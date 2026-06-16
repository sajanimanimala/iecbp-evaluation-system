"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email) {
            setError('Email is required.');
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError('Invalid email address.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data?.message || 'Unable to process request');
                return;
            }
            setMessage(data?.message || 'If an account exists with this email, a reset link will be sent.');
            setEmail('');
        } catch (err) {
            console.error(err);
            setError('Unexpected error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f1623 0%, #121826 40%, #182235 70%, #1a2540 100%)',
            padding: '3rem'
        }}>
            <form onSubmit={handleSubmit} style={{ width: '420px', background: 'linear-gradient(145deg,#0f172a,#111827)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#F8FAFC', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Forgot Password</h2>
                <p style={{ color: '#94A3B8', marginBottom: '1rem' }}>Enter your email address and we'll send you a link to reset your password.</p>

                {error && <div style={{ marginBottom: '12px', padding: '10px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', color: '#FCA5A5' }}>{error}</div>}
                {message && <div style={{ marginBottom: '12px', padding: '10px', borderRadius: '8px', background: 'rgba(34,197,94,0.12)', color: '#86EFAC' }}>{message}</div>}

                <label style={{ display: 'block', color: '#94A3B8', marginBottom: '6px' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mb-4 p-3 rounded-lg bg-slate-900/40 border border-white/6 text-slate-200" />

                <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg,#6366F1,#7C3AED)', color: '#fff', fontWeight: 700, marginBottom: '12px' }}>{loading ? 'Sending...' : 'Send Reset Link'}</button>

                <button type="button" onClick={() => router.push('/login')} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', fontWeight: 700 }}>Back to Login</button>
            </form>
        </div>
    );
}
