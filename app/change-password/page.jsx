"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required.');
            return;
        }
        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data?.message || 'Unable to change password');
                setLoading(false);
                return;
            }
            setMessage(data?.message || 'Password updated successfully!');
            setTimeout(() => router.push('/profile?updated=true'), 1500);
        } catch (err) {
            console.error(err);
            setError('Unexpected error');
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
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#F8FAFC', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Change Password</h2>
                <p style={{ color: '#94A3B8', marginBottom: '1rem' }}>Update your password securely.</p>

                {error && <div style={{ marginBottom: '12px', padding: '10px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', color: '#FCA5A5' }}>{error}</div>}
                {message && <div style={{ marginBottom: '12px', padding: '10px', borderRadius: '8px', background: 'rgba(34,197,94,0.12)', color: '#86EFAC' }}>{message}</div>}

                <label style={{ display: 'block', color: '#94A3B8', marginBottom: '6px' }}>Current Password</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full mb-3 p-3 rounded-lg bg-slate-900/40 border border-white/6 text-slate-200" />

                <label style={{ display: 'block', color: '#94A3B8', marginBottom: '6px' }}>New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full mb-3 p-3 rounded-lg bg-slate-900/40 border border-white/6 text-slate-200" />

                <label style={{ display: 'block', color: '#94A3B8', marginBottom: '6px' }}>Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full mb-4 p-3 rounded-lg bg-slate-900/40 border border-white/6 text-slate-200" />

                <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg,#6366F1,#7C3AED)', color: '#fff', fontWeight: 700, marginBottom: '12px' }}>{loading ? 'Updating...' : 'Update Password'}</button>

                <button type="button" onClick={() => router.push('/profile')} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', fontWeight: 700 }}>Back to Profile</button>
            </form>
        </div>
    );
}
