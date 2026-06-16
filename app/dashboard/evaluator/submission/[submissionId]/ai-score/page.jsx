'use client';

import { useParams, useRouter } from 'next/navigation';
import DashboardHeader from '../../../../../../components/DashboardHeader';
export default function AiScorePage() {
  const { submissionId } = useParams();
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f1623 0%, #121826 40%, #182235 70%, #1a2540 100%)',
        color: '#F8FAFC',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <DashboardHeader />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 24px',
        }}
      >
        <button
          onClick={() =>
            router.push(`/dashboard/evaluator/submission/${submissionId}`)
          }
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            background: '#6366F1',
            color: 'white',
            cursor: 'pointer',
            marginBottom: '24px',
          }}
        >
          ← Back
        </button>

        <h1
          style={{
            fontSize: '42px',
            fontWeight: '700',
            marginBottom: '12px',
          }}
        >
          AI Score Review
        </h1>

        <p
          style={{
            color: '#94A3B8',
            marginBottom: '32px',
          }}
        >
          Submission ID: {submissionId}
        </p>

        <div
          style={{
            background: '#1E293B',
            padding: '24px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <h2 style={{ marginBottom: '20px' }}>AI Evaluation (Placeholder)</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2,1fr)',
              gap: '16px',
            }}
          >
            {['Understanding', 'Awareness', 'Decision', 'Clarity'].map(
              (item) => (
                <div
                  key={item}
                  style={{
                    background: '#0F172A',
                    padding: '18px',
                    borderRadius: '14px',
                  }}
                >
                  <h3>{item}</h3>
                  <p style={{ color: '#94A3B8' }}>Score: --</p>
                  <p style={{ color: '#CBD5E1' }}>Evidence: --</p>
                </div>
              )
            )}
          </div>

          <div
            style={{
              marginTop: '30px',
              display: 'flex',
              gap: '12px',
            }}
          >
            <button
              style={{
                background: '#22C55E',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              Accept
            </button>

            <button
              style={{
                background: '#3B82F6',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              Modify
            </button>

            <button
              style={{
                background: '#EF4444',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}