'use client';

import { motion, AnimatePresence } from 'framer-motion';

const OPTION_COLORS = {
  A: { base: '#60A5FA', bg: 'rgba(96,165,250,0.09)', border: 'rgba(96,165,250,0.38)', glow: 'rgba(96,165,250,0.2)' },
  B: { base: '#A78BFA', bg: 'rgba(167,139,250,0.09)', border: 'rgba(167,139,250,0.38)', glow: 'rgba(167,139,250,0.2)' },
  C: { base: '#34D399', bg: 'rgba(52,211,153,0.09)', border: 'rgba(52,211,153,0.38)', glow: 'rgba(52,211,153,0.2)' },
  D: { base: '#FB923C', bg: 'rgba(251,146,60,0.09)', border: 'rgba(251,146,60,0.38)', glow: 'rgba(251,146,60,0.2)' },
  E: { base: '#F472B6', bg: 'rgba(244,114,182,0.09)', border: 'rgba(244,114,182,0.38)', glow: 'rgba(244,114,182,0.2)' },
  F: { base: '#FBBF24', bg: 'rgba(251,191,36,0.09)', border: 'rgba(251,191,36,0.38)', glow: 'rgba(251,191,36,0.2)' },
};

export default function MultiSelectQuestion({ question, value, onChange, readOnly = false }) {
  const selected = Array.isArray(value) ? value : (typeof value === 'string' ? [value] : []);
  const max = Number.isFinite(question.maxSelections) ? question.maxSelections : 2;
  const atMax = selected.length >= max;

  const normalizedOptions = Array.isArray(question.options)
    ? question.options.map((option, index) => {
        if (typeof option === 'string') {
          const text = option.trim();
          return {
            key: text || String.fromCharCode(65 + index),
            text,
          };
        }

        if (option && typeof option === 'object') {
          const text = option.text ?? option.label ?? option.optionText ?? option.value ?? option.title ?? `Option ${index + 1}`;
          const key = option.key ?? option.value ?? option.id ?? String.fromCharCode(65 + index);
          return {
            key: String(key).trim().toUpperCase() || String.fromCharCode(65 + index),
            text: typeof text === 'string' ? text.trim() : String(text),
            icon: option.icon,
          };
        }

        return {
          key: String.fromCharCode(65 + index),
          text: `Option ${index + 1}`,
        };
      })
    : [];

  const toggle = (option) => {
    if (readOnly) return;

    const optionValue = option?.key;
    if (!optionValue) return;

    if (selected.includes(optionValue)) {
      onChange(selected.filter((item) => item !== optionValue));
      return;
    }

    if (atMax) return;

    onChange([...selected, optionValue]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── IMAGE (optional) ── */}
      {question.imageSrc && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          style={{ marginBottom: '1.25rem' }}
        >
          <div style={{
            borderRadius: '16px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
            position: 'relative',
          }}>
            <img
              src={question.imageSrc}
              alt={question.imageCaption || 'Scenario reference image'}
              style={{
                width: '100%', display: 'block',
                maxHeight: '340px', objectFit: 'cover',
              }}
            />
            {/* image overlay gradient bottom */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px',
              background: 'linear-gradient(to top, rgba(15,22,35,0.85), transparent)',
            }} />
            {/* caption */}
            {question.imageCaption && (
              <div style={{
                position: 'absolute', bottom: '10px', left: '14px',
                fontSize: '11px', color: '#94A3B8', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                {question.imageCaption}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* instruction banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '10px 16px',
        background: 'rgba(99,102,241,0.07)',
        border: '1px solid rgba(99,102,241,0.18)',
        borderRadius: '12px',
        marginBottom: '1.25rem',
      }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
          background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </div>
        <div>
          <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 400 }}>
            Select{' '}
            {max === question.options?.length
              ? <span style={{ color: '#818CF8', fontWeight: 700 }}>all that apply</span>
              : <><span style={{ color: '#818CF8', fontWeight: 700 }}>{max} options</span></>
            }
            {' '}— choose the most relevant
          </span>
        </div>
        {/* counter */}
        <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '4px 12px', borderRadius: '999px',
            background: atMax ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
            border: atMax ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(255,255,255,0.08)',
            transition: 'all 0.3s ease',
          }}>
            <span style={{
              fontSize: '13px', fontWeight: 800,
              color: atMax ? '#4ADE80' : '#64748B',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {selected.length}
            </span>
            <span style={{ fontSize: '12px', color: '#475569' }}>/ {max}</span>
          </div>
        </div>
      </div>

      {/* option cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {normalizedOptions.map((option, i) => {
          const optionValue = option.key;
          const isSelected = selected.includes(optionValue);
          const isDisabled = atMax && !isSelected;
          const colors = OPTION_COLORS[option.key] || OPTION_COLORS.A;

          return (
            <motion.div
              key={option.key}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              whileHover={!isDisabled ? { y: -2 } : {}}
              whileTap={!isDisabled ? { scale: 0.985 } : {}}
              onClick={() => toggle(option)}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem 1.25rem',
                background: isSelected
                  ? colors.bg
                  : isDisabled
                  ? 'rgba(15,22,35,0.5)'
                  : 'rgba(22,32,50,0.7)',
                border: isSelected
                  ? `1.5px solid ${colors.border}`
                  : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                cursor: readOnly || isDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                opacity: isDisabled ? 0.4 : 1,
                boxShadow: isSelected
                  ? `0 0 28px ${colors.glow}, 0 6px 20px rgba(0,0,0,0.2)`
                  : '0 2px 12px rgba(0,0,0,0.15)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* shimmer top line */}
              {isSelected && (
                <div style={{
                  position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
                  background: `linear-gradient(90deg, transparent, ${colors.base}70, transparent)`,
                }} />
              )}

              {/* checkbox */}
              <motion.div
                animate={{
                  background: isSelected ? colors.base : 'transparent',
                  borderColor: isSelected ? colors.base : 'rgba(255,255,255,0.15)',
                  boxShadow: isSelected ? `0 0 12px ${colors.glow}` : 'none',
                }}
                transition={{ duration: 0.2 }}
                style={{
                  width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                  border: '1.5px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <AnimatePresence>
                  {isSelected && (
                    <motion.svg
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                      width="11" height="11" viewBox="0 0 24 24"
                      fill="none" stroke="#fff" strokeWidth="3.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* icon */}
              {option.icon && (
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{option.icon}</span>
              )}

              {/* option key badge */}
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                background: isSelected ? `${colors.base}25` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isSelected ? colors.border : 'rgba(255,255,255,0.06)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.25s ease',
              }}>
                <span style={{
                  fontSize: '11px', fontWeight: 800,
                  color: isSelected ? colors.base : '#475569',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  {option.key}
                </span>
              </div>

              {/* text */}
              <span style={{
                flex: 1, fontSize: '14px',
                fontWeight: isSelected ? 600 : 400,
                color: isSelected ? '#F8FAFC' : isDisabled ? '#334155' : '#94A3B8',
                lineHeight: 1.5, transition: 'all 0.25s ease',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                {option.text}
              </span>

              {/* selected position badge */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: colors.base,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: `0 0 10px ${colors.glow}`,
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff' }}>
                    {selected.indexOf(optionValue) + 1}
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '1rem', paddingLeft: '0.25rem' }}>
        <motion.div
          animate={{
            background: atMax ? '#4ADE80' : selected.length > 0 ? '#F59E0B' : '#334155',
            boxShadow: atMax ? '0 0 8px rgba(74,222,128,0.6)' : 'none',
          }}
          style={{ width: '7px', height: '7px', borderRadius: '50%' }}
        />
        <span style={{
          fontSize: '12px', fontWeight: 500,
          color: atMax ? '#4ADE80' : selected.length > 0 ? '#F59E0B' : '#475569',
          transition: 'color 0.3s ease',
        }}>
          {atMax
            ? `${max} options selected — ready to continue`
            : selected.length > 0
            ? `${selected.length} of ${max} selected — pick ${max - selected.length} more`
            : `Select ${max} areas to continue`}
        </span>
      </div>
    </motion.div>
  );
}