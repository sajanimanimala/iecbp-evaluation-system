'use client';

import { motion } from 'framer-motion';

export default function ScenariosPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '4px 14px', borderRadius: '999px',
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          marginBottom: '1rem',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366F1', boxShadow: '0 0 8px #6366F1' }} />
          <span style={{ fontSize: '11px', color: '#818CF8', fontWeight: 600, letterSpacing: '0.5px' }}>SCENARIO MANAGEMENT</span>
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2rem', fontWeight: 700,
          color: '#F8FAFC', margin: '0 0 0.5rem',
        }}>
          Scenarios
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 2rem' }}>
          Create, view, update, and delete evaluation scenarios.
        </p>

        <div style={{
          background: 'linear-gradient(145deg, #1E2A40, #24324A)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px',
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '520px',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.5rem' }}>
            Scenario Management Coming Soon
          </div>
          <div style={{ fontSize: '13px', color: '#475569' }}>
            Create, edit, and manage all evaluation scenarios from this panel.
          </div>
        </div>
      </motion.div>
    </div>
  );
}