'use client';

import { motion } from 'framer-motion';

export default function ResultsPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '4px 14px', borderRadius: '999px',
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
          marginBottom: '1rem',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 8px #F59E0B' }} />
          <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 600, letterSpacing: '0.5px' }}>RESULTS MANAGEMENT</span>
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2rem', fontWeight: 700,
          color: '#F8FAFC', margin: '0 0 0.5rem',
        }}>
          Results
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 2rem' }}>
          View and manage final evaluation results for all candidates.
        </p>

        <div style={{
          background: 'linear-gradient(145deg, #1E2A40, #24324A)',
          border: '1px solid rgba(245,158,11,0.12)',
          borderRadius: '20px',
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '520px',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏆</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.5rem' }}>
            Results Dashboard Coming Soon
          </div>
          <div style={{ fontSize: '13px', color: '#475569' }}>
            View final evaluated results, scores, and performance summaries for all candidates.
          </div>
        </div>
      </motion.div>
    </div>
  );
}