'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '../../../../../components/DashboardHeader';
import { fetchSession, redirectPathForRole } from '../../../../../components/auth/auth';

export default function SubmissionDetailPage({ params }) {
  const { submissionId } = React.use(params);
  const router = useRouter();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const sessionUser = await fetchSession();
      if (!sessionUser) {
        router.replace('/login');
        return;
      }
      if (sessionUser.role !== 'EVALUATOR') {
        router.replace(redirectPathForRole(sessionUser.role));
        return;
      }

      try {
        const res = await fetch(`/api/evaluator/submission/${submissionId}`);
        const data = await res.json();
        if (!mounted) return;
        if (!res.ok || !data.success) {
          setError(data.message || data.error || 'Unable to load submission');
        } else {
          setSubmission(data.submission);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Unable to load submission');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [submissionId, router]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1623 0%, #121826 40%, #182235 70%, #1a2540 100%)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative',
      overflowX: 'hidden',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <DashboardHeader />
      <main style={{ position: 'relative', zIndex: 1, padding: '3rem 2.5rem 3rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.9rem, 3vw, 2.6rem)', fontWeight: 700, color: '#F8FAFC', margin: '0 0 0.5rem', lineHeight: 1.1 }}>Submission Details</h1>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>Review the submitted answers for the selected candidate code and view AI scoring.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={() => router.push('/dashboard/evaluator')} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#E2E8F0', borderRadius: '12px', padding: '10px 16px', cursor: 'pointer' }}>← Back to submissions</button>
            <button onClick={() => router.push(`/dashboard/evaluator/submission/${submissionId}/evaluation`)} style={{ background: 'linear-gradient(135deg, #6366F1, #7C3AED)', border: 'none', borderRadius: '12px', padding: '10px 16px', color: '#fff', cursor: 'pointer' }}>View Evaluation</button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.06)', color: '#CBD5E1' }}>Loading submission...</div>
        ) : error ? (
          <div style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(248,113,113,0.25)', color: '#FBCFE8' }}>{error}</div>
        ) : submission ? (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ background: 'linear-gradient(145deg, #1B273A, #22314A)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <div>
                  <div style={{ color: '#94A3B8', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Candidate Code</div>
                  <div style={{ color: '#F8FAFC', fontSize: '1.25rem', fontWeight: 700 }}>{submission.candidateCode}</div>
                </div>
                <div>
                  <div style={{ color: '#94A3B8', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Scenario</div>
                  <div style={{ color: '#F8FAFC', fontSize: '1.25rem', fontWeight: 700 }}>{submission.scenario}</div>
                </div>
                <div>
                  <div style={{ color: '#94A3B8', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Submission Date</div>
                  <div style={{ color: '#F8FAFC', fontSize: '1.25rem', fontWeight: 700 }}>{new Date(submission.date).toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ color: '#94A3B8', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Status</div>
                  <div style={{ color: '#F8FAFC', fontSize: '1.25rem', fontWeight: 700, textTransform: 'capitalize' }}>{submission.status}</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(145deg, #1B273A, #22314A)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '1.75rem' }}>
              <h2 style={{ color: '#F8FAFC', fontSize: '1.4rem', marginBottom: '1rem' }}>Questions & Answers</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {submission.questions.map((question, index) => (
                  <div key={question.id} style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '18px', padding: '1.25rem' }}>
                    <div style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: '0.75rem' }}>Q{index + 1}. {question.question}</div>
                    <div style={{ color: '#CBD5E1', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{question.answer}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : null}
      </main>
    </div>
  );
}
