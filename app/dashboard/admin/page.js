'use client';

import { motion } from 'framer-motion';

const stats = [
  {
    label: 'Total Scenarios',
    value: '6',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    color: '#6366F1',
    bg: 'rgba(99,102,241,0.1)',
    border: 'rgba(99,102,241,0.25)',
    glow: 'rgba(99,102,241,0.2)',
  },
  {
    label: 'Total Candidates',
    value: '25',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: '#60A5FA',
    bg: 'rgba(96,165,250,0.1)',
    border: 'rgba(96,165,250,0.25)',
    glow: 'rgba(96,165,250,0.2)',
  },
  {
    label: 'Total Evaluators',
    value: '5',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <polyline points="9 11 12 14 22 4" />
      </svg>
    ),
    color: '#34D399',
    bg: 'rgba(52,211,153,0.1)',
    border: 'rgba(52,211,153,0.25)',
    glow: 'rgba(52,211,153,0.2)',
  },
  {
    label: 'Total Submissions',
    value: '40',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.1)',
    border: 'rgba(167,139,250,0.25)',
    glow: 'rgba(167,139,250,0.2)',
  },
];

const recentActivity = [
  {
    text: 'Candidate submitted Scenario 1',
    time: '2 min ago',
    icon: '📝',
    color: '#6366F1',
  },
  {
    text: 'Candidate submitted Scenario 3',
    time: '18 min ago',
    icon: '📝',
    color: '#6366F1',
  },
  {
    text: 'Evaluator reviewed Submission 5',
    time: '1 hr ago',
    icon: '✅',
    color: '#34D399',
  },
  {
    text: 'Result generated for Submission 10',
    time: '3 hrs ago',
    icon: '🏆',
    color: '#F59E0B',
  },
];

export default function AdminDashboard() {
  return (
    <div>
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: '2rem' }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '4px 14px', borderRadius: '999px',
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          marginBottom: '1rem',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366F1', boxShadow: '0 0 8px #6366F1' }} />
          <span style={{ fontSize: '11px', color: '#818CF8', fontWeight: 600, letterSpacing: '0.5px' }}>
            ADMINISTRATION PANEL
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2rem', fontWeight: 700,
          color: '#F8FAFC', margin: '0 0 0.5rem',
          letterSpacing: '-0.3px',
        }}>
          Admin Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          IECBP Evaluation System Administration
        </p>
      </motion.div>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            whileHover={{ y: -3, boxShadow: `0 20px 50px rgba(0,0,0,0.35), 0 0 40px ${stat.glow}` }}
            style={{
              background: 'linear-gradient(145deg, #1B273A, #22314A)',
              border: `1px solid ${stat.border}`,
              borderRadius: '18px',
              padding: '1.5rem',
              position: 'relative', overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              cursor: 'default',
            }}
          >
            {/* top shimmer */}
            <div style={{
              position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
              background: `linear-gradient(90deg, transparent, ${stat.color}60, transparent)`,
            }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: stat.bg,
                border: `1px solid ${stat.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: stat.color,
                boxShadow: `0 0 16px ${stat.glow}`,
              }}>
                {stat.icon}
              </div>
            </div>

            <div style={{
              fontSize: '2.25rem', fontWeight: 800,
              color: '#F8FAFC', lineHeight: 1,
              marginBottom: '6px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontVariantNumeric: 'tabular-nums',
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          background: 'linear-gradient(145deg, #1E2A40, #24324A)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px',
          padding: '1.75rem',
          position: 'relative', overflow: 'hidden',
          maxWidth: '720px',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)',
        }} />

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.7px', color: '#475569', marginBottom: '4px' }}>
            RECENT ACTIVITY
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC', fontFamily: "'Playfair Display', serif" }}>
            Latest Platform Events
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {recentActivity.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              {/* timeline line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '10px',
                  background: `${item.color}12`,
                  border: `1px solid ${item.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px',
                }}>
                  {item.icon}
                </div>
                {i < recentActivity.length - 1 && (
                  <div style={{
                    width: '1px', height: '28px',
                    background: 'rgba(255,255,255,0.05)',
                    margin: '4px 0',
                  }} />
                )}
              </div>

              <div style={{ paddingTop: '6px', paddingBottom: i < recentActivity.length - 1 ? '0' : '0' }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#CBD5E1', lineHeight: 1.4 }}>
                  {item.text}
                </div>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '3px' }}>
                  {item.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}