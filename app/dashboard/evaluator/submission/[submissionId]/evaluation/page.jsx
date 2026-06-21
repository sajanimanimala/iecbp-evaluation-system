'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardHeader from '../../../../../../components/DashboardHeader';
import { fetchSession, redirectPathForRole } from '../../../../../../components/auth/auth';

const EVIDENCE_GROUPS = ['CAUSE', 'DECISION', 'RISK', 'STAKEHOLDER', 'ACTION'];

export default function EvaluationDetailsPage() {
  const { submissionId } = useParams();
  const router = useRouter();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadSubmission() {
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
          setError(data.message || data.error || 'Unable to load evaluation details');
          setSubmission(null);
        } else {
          setSubmission(data.submission);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Unable to load evaluation details');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    loadSubmission();
    return () => { mounted = false; };
  }, [submissionId, router]);

  const ai = submission?.ai;

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
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.9rem, 3vw, 2.6rem)', fontWeight: 700, color: '#F8FAFC', margin: '0 0 0.5rem', lineHeight: 1.1 }}>Evaluation Details</h1>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>Review the evaluation scores, indices, and evidence extracted from the submission.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={() => router.push(`/dashboard/evaluator/submission/${submissionId}`)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#E2E8F0', borderRadius: '12px', padding: '10px 16px', cursor: 'pointer' }}>← Back to submission</button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.06)', color: '#CBD5E1' }}>Loading evaluation details...</div>
        ) : error ? (
          <div style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(248,113,113,0.25)', color: '#FBCFE8' }}>{error}</div>
        ) : !submission ? (
          <div style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.06)', color: '#CBD5E1' }}>Submission not found.</div>
        ) : (
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
                  <div style={{ color: '#94A3B8', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Submission ID</div>
                  <div style={{ color: '#F8FAFC', fontSize: '1.25rem', fontWeight: 700 }}>{submission.id}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Understanding', value: ai?.understanding },
                  { label: 'Awareness', value: ai?.awareness },
                  { label: 'Decision', value: ai?.decision },
                  { label: 'Actionability', value: ai?.actionability },
                  { label: 'Clarity', value: ai?.clarity },
                ].map(item => (
                  <div key={item.label} style={{ background: 'linear-gradient(145deg, #1F2A40, #252F43)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '1.5rem' }}>
                    <div style={{ color: '#94A3B8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>{item.label}</div>
                    <div style={{ color: '#F8FAFC', fontSize: '2rem', fontWeight: 700 }}>{typeof item.value === 'number' ? item.value : '--'}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Capability Index', value: ai?.capabilityIndex },
                  { label: 'Confidence Index', value: ai?.confidenceIndex },
                  { label: 'Coverage Index', value: ai?.coverageIndex },
                ].map(item => (
                  <div key={item.label} style={{ background: 'linear-gradient(145deg, #1F2A40, #252F43)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '1.5rem' }}>
                    <div style={{ color: '#94A3B8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>{item.label}</div>
                    <div style={{ color: '#F8FAFC', fontSize: '1.5rem', fontWeight: 700 }}>{typeof item.value === 'number' ? item.value : '--'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
