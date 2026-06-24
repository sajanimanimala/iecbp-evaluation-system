'use client';

import { motion } from 'framer-motion';

export default function AdminDashboardContent({ stats, recentActivity }) {
  return (
    <div>
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
          {recentActivity.length === 0 ? (
            <div style={{ fontSize: '13px', color: '#CBD5E1', padding: '0.5rem 0' }}>
              No recent activity yet.
            </div>
          ) : recentActivity.map((item, i) => (
            <div key={`${item.text}-${i}`} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
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

              <div style={{ paddingTop: '6px' }}>
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
