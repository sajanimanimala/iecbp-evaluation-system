'use client';

import { motion } from 'framer-motion';

export default function SubmissionsPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '4px 14px', borderRadius: '999px',
          background: 'rgba(167,139,250,0.08)',
          border: '1px solid rgba(167,139,250,0.2)',
          marginBottom: '1rem',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#A78BFA', boxShadow: '0 0 8px #A78BFA' }} />
          <span style={{ fontSize: '11px', color: '#A78BFA', fontWeight: 600, letterSpacing: '0.5px' }}>SUBMISSION MANAGEMENT</span>
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2rem', fontWeight: 700,
          color: '#F8FAFC', margin: '0 0 0.5rem',
        }}>
          Submissions
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 2rem' }}>
          View candidates who attempted assessments, submission details, and submitted answers.
        </p>

        <div style={{
          background: 'linear-gradient(145deg, #1E2A40, #24324A)',
          border: '1px solid rgba(167,139,250,0.12)',
          borderRadius: '20px',
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '520px',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.5rem' }}>
            Submissions Overview Coming Soon
          </div>
          <div style={{ fontSize: '13px', color: '#475569' }}>
            Review all submitted assessments, individual answers, and completion status from this panel.
          </div>
        </div>
      </motion.div>
    </div>
  );
}