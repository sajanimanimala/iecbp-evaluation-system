'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

const RANK_COLORS = [
  { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.4)', text: '#818CF8', glow: 'rgba(99,102,241,0.25)', label: '1st' },
  { bg: 'rgba(96,165,250,0.10)', border: 'rgba(96,165,250,0.35)', text: '#60A5FA', glow: 'rgba(96,165,250,0.2)', label: '2nd' },
  { bg: 'rgba(167,139,250,0.10)', border: 'rgba(167,139,250,0.35)', text: '#A78BFA', glow: 'rgba(167,139,250,0.2)', label: '3rd' },
  { bg: 'rgba(52,211,153,0.10)', border: 'rgba(52,211,153,0.35)', text: '#34D399', glow: 'rgba(52,211,153,0.2)', label: '4th' },
];

export default function DragRankQuestion({ question, value, onChange, readOnly = false }) {
  const initialItems = question.items.map((item) => item.id);
  const [order, setOrder] = useState(() => {
    if (value && Array.isArray(value) && value.length === question.items.length) return value;
    return initialItems;
  });
  const [dragging, setDragging] = useState(null);
  const hasInteracted = useRef(false);

  const itemMap = Object.fromEntries(question.items.map((item) => [item.id, item]));

  const handleReorder = (newOrder) => {
    hasInteracted.current = true;
    setOrder(newOrder);
    onChange(newOrder);
  };

  // mark as answered on first interaction
  useEffect(() => {
    if (!value) {
      onChange(order);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* instruction bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '10px 16px',
        background: 'rgba(245,158,11,0.07)',
        border: '1px solid rgba(245,158,11,0.2)',
        borderRadius: '12px',
        marginBottom: '1.25rem',
      }}>
        <span style={{ fontSize: '16px' }}>↕️</span>
        <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 400 }}>
          <span style={{ color: '#F59E0B', fontWeight: 700 }}>Drag</span> the cards to reorder —{' '}
          highest priority at the top
        </span>
      </div>

      {/* Reorder list */}
      <Reorder.Group
        axis="y"
        values={order}
        onReorder={readOnly ? () => {} : handleReorder}
        disabled={readOnly}
        style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
      >
        {order.map((id, index) => {
          const item = itemMap[id];
          const colors = RANK_COLORS[index] || RANK_COLORS[3];
          const isDragging = dragging === id;

          return (
            <Reorder.Item
              key={id}
              value={id}
              onDragStart={() => setDragging(id)}
              onDragEnd={() => setDragging(null)}
              style={{ listStyle: 'none' }}
            >
              <motion.div
                layout
                animate={{
                  scale: isDragging ? 1.03 : 1,
                  boxShadow: isDragging
                    ? `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${colors.glow}`
                    : `0 4px 20px rgba(0,0,0,0.2)`,
                }}
                transition={{ duration: 0.2 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1.1rem 1.25rem',
                  background: isDragging
                    ? 'rgba(30,44,68,0.98)'
                    : colors.bg,
                  border: isDragging
                    ? `1.5px solid ${colors.border}`
                    : `1px solid ${colors.border}`,
                  borderRadius: '16px',
                  cursor: 'grab',
                  userSelect: 'none',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* shimmer line at top */}
                <div style={{
                  position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
                  background: `linear-gradient(90deg, transparent, ${colors.text}50, transparent)`,
                }} />

                {/* drag handle */}
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: '3px',
                  flexShrink: 0, opacity: 0.5, padding: '4px',
                }}>
                  {[0, 1, 2].map((r) => (
                    <div key={r} style={{
                      display: 'flex', gap: '3px',
                    }}>
                      {[0, 1].map((c) => (
                        <div key={c} style={{
                          width: '3px', height: '3px', borderRadius: '50%',
                          background: colors.text,
                        }} />
                      ))}
                    </div>
                  ))}
                </div>

                {/* rank badge */}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                  background: `${colors.text}18`,
                  border: `1.5px solid ${colors.border}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isDragging ? `0 0 16px ${colors.glow}` : 'none',
                  transition: 'box-shadow 0.2s ease',
                }}>
                  <span style={{
                    fontSize: '14px', fontWeight: 800, color: colors.text,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    lineHeight: 1,
                  }}>
                    #{index + 1}
                  </span>
                  <span style={{
                    fontSize: '9px', color: colors.text, fontWeight: 600,
                    opacity: 0.7, letterSpacing: '0.3px',
                  }}>
                    {colors.label.toUpperCase()}
                  </span>
                </div>

                {/* icon */}
                <span style={{ fontSize: '22px', flexShrink: 0 }}>{item.icon}</span>

                {/* label */}
                <span style={{
                  flex: 1, fontSize: '14px', fontWeight: 600,
                  color: isDragging ? '#F8FAFC' : '#CBD5E1',
                  lineHeight: 1.45,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: 'color 0.2s ease',
                }}>
                  {item.label}
                </span>

                {/* drag indicator */}
                {isDragging && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      flexShrink: 0, padding: '4px 10px',
                      background: `${colors.text}20`,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                    }}
                  >
                    <span style={{ fontSize: '11px', color: colors.text, fontWeight: 600 }}>Moving</span>
                  </motion.div>
                )}
              </motion.div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {/* current order summary */}
      <div style={{
        marginTop: '1.25rem',
        padding: '1rem 1.25rem',
        background: 'rgba(22,32,50,0.6)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center',
      }}>
        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, letterSpacing: '0.5px', marginRight: '4px' }}>
          YOUR ORDER:
        </span>
        {order.map((id, i) => {
          const item = itemMap[id];
          const colors = RANK_COLORS[i] || RANK_COLORS[3];
          return (
            <div key={id} style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '3px 10px', borderRadius: '8px',
              background: colors.bg,
              border: `1px solid ${colors.border}`,
            }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: colors.text }}>
                {i + 1}.
              </span>
              <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>
                {item.icon} {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '0.75rem', paddingLeft: '0.25rem' }}>
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 8px rgba(74,222,128,0.6)' }} />
        <span style={{ fontSize: '12px', fontWeight: 500, color: '#4ADE80' }}>
          Order recorded — drag to change priority
        </span>
      </div>
    </motion.div>
  );
}