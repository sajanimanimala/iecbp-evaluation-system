"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchSession } from '../../components/auth/auth';

export default function ProfilePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState(null);
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        let mounted = true;
        async function load() {
            const sessionUser = await fetchSession();
            if (!sessionUser) {
                router.push('/login');
                return;
            }
            if (mounted) setUser(sessionUser);

            if (searchParams.get('updated') === 'true' && mounted) {
                setMessage('Password updated successfully!');
                setTimeout(() => setMessage(''), 3000);
            }

            try {
                const res = await fetch('/api/auth/session');
                if (res.ok) {
                    const data = await res.json();
                    if (data.ok && data.user) {
                        const candidateRes = await fetch(`/api/candidates/${data.user.id}`);
                        if (candidateRes.ok) {
                            const candidateData = await candidateRes.json();
                            if (mounted) setCandidate(candidateData);
                        }
                    }
                }
            } catch (e) { }
            if (mounted) setLoading(false);
        }
        load();
        return () => { mounted = false; };
    }, [router, searchParams]);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #0f1623 0%, #121826 40%, #182235 70%, #1a2540 100%)',
            }}>
                <div style={{ color: '#94A3B8' }}>Loading...</div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f1623 0%, #121826 40%, #182235 70%, #1a2540 100%)',
            padding: '3rem'
        }}>
            <div style={{ width: '520px', background: 'linear-gradient(145deg,#0f172a,#111827)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#F8FAFC', fontSize: '1.75rem', marginBottom: '1.5rem' }}>Your Profile</h2>

                {message && <div style={{ marginBottom: '12px', padding: '10px', borderRadius: '8px', background: 'rgba(34,197,94,0.12)', color: '#86EFAC' }}>{message}</div>}

                {user && (
                    <div>
                        <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <div style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 500, letterSpacing: '0.5px', marginBottom: '4px' }}>FULL NAME</div>
                            <div style={{ color: '#E2E8F0', fontSize: '16px', fontWeight: 600 }}>{user.name || 'Not provided'}</div>
                        </div>

                        <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <div style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 500, letterSpacing: '0.5px', marginBottom: '4px' }}>EMAIL</div>
                            <div style={{ color: '#E2E8F0', fontSize: '16px', fontWeight: 600 }}>{user.email}</div>
                        </div>

                        {candidate && (
                            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                <div style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 500, letterSpacing: '0.5px', marginBottom: '4px' }}>CANDIDATE CODE (USERNAME)</div>
                                <div style={{ color: '#E2E8F0', fontSize: '16px', fontWeight: 600, fontFamily: 'monospace' }}>{candidate.candidate_code}</div>
                            </div>
                        )}

                        <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <div style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 500, letterSpacing: '0.5px', marginBottom: '4px' }}>ROLE</div>
                            <div style={{ color: '#E2E8F0', fontSize: '16px', fontWeight: 600 }}>{user.role}</div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 500, letterSpacing: '0.5px', marginBottom: '4px' }}>ACCOUNT STATUS</div>
                            <div style={{ color: '#E2E8F0', fontSize: '16px', fontWeight: 600 }}>Verified</div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => router.push('/dashboard/candidate')} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', fontWeight: 700 }}>Back to Dashboard</button>
                            <button onClick={() => router.push('/change-password')} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg,#6366F1,#7C3AED)', color: '#fff', fontWeight: 700 }}>Change Password</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
