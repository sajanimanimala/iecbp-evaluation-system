'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '../../../../../../components/DashboardHeader';

export default function AiScorePage({ params }) {
  const { submissionId } = React.use(params);
  const router = useRouter();
  const cards = Array.from({ length: 10 }, (_, index) => index + 1);
  const factors = ['Understanding', 'Awareness', 'Decision', 'Clarity'];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1623 0%, #121826 40%, #182235 70%, #1a2540 100%)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative',
      overflowX: 'hidden',
      color: '#F8FAFC',
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
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.9rem, 3vw, 2.6rem)', fontWeight: 700, color: '#F8FAFC', margin: '0 0 0.5rem', lineHeight: 1.1 }}>AI Score Review</h1>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>Review the AI score structure for submission {submissionId}. This page is a placeholder layout for flashcard-style evaluation cards.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={() => router.push(`/dashboard/evaluator/submission/${submissionId}`)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#E2E8F0', borderRadius: '12px', padding: '10px 16px', cursor: 'pointer' }}>← Back to submission</button>
            <button onClick={() => router.push('/dashboard/evaluator')} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#E2E8F0', borderRadius: '12px', padding: '10px 16px', cursor: 'pointer' }}>Back to submissions</button>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {cards.map(card => (
            <div key={card} style={{
              background: 'linear-gradient(145deg, #1B273A, #22314A)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '24px',
              padding: '1.75rem',
              boxShadow: '0 24px 60px rgba(0,0,0,0.18)'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ color: '#94A3B8', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Flashcard {card}</div>
                  <div style={{ color: '#F8FAFC', fontSize: '1.2rem', fontWeight: 700 }}>Scenario {card}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#94A3B8', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Scenario name</div>
                  <div style={{ color: '#F8FAFC', fontSize: '1rem', fontWeight: 600 }}>Placeholder scenario name</div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ color: '#94A3B8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Question</div>
                <div style={{ color: '#E2E8F0', lineHeight: 1.8 }}>Placeholder question text for this scenario. This is the question prompt that the candidate answered.</div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ color: '#94A3B8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Answer</div>
                <div style={{ color: '#CBD5E1', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>Placeholder answer content from the submission. AI scoring structure will be layered on top of this response.</div>
              </div>

              <div style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '18px', padding: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ color: '#94A3B8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>AI Score</div>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {factors.map(factor => (
                    <div key={factor} style={{ display: 'grid', gap: '0.5rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{factor}</span>
                        <span style={{ color: '#A5B4FC', fontSize: '0.95rem' }}>Score: --</span>
                      </div>
                      <div style={{ color: '#CBD5E1', fontSize: '0.95rem', lineHeight: 1.6 }}>Evidence: --</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <button style={{ flex: '1 1 160px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)', color: '#A7F3D0', borderRadius: '14px', padding: '12px 16px', cursor: 'pointer' }}>Accept</button>
                <button style={{ flex: '1 1 160px', background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.35)', color: '#FECACA', borderRadius: '14px', padding: '12px 16px', cursor: 'pointer' }}>Reject</button>
                <button style={{ flex: '1 1 160px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.35)', color: '#BFDBFE', borderRadius: '14px', padding: '12px 16px', cursor: 'pointer' }}>Modify</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
