'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

function normalizeQuestionOptions(options = []) {
  const seenKeys = new Set();

  return Array.isArray(options)
    ? options.map((option, index) => {
      let key;
      let text;
      let icon;

      if (typeof option === 'string') {
        const trimmed = option.trim();
        text = trimmed || `Option ${index + 1}`;
        key = trimmed ? trimmed[0].toUpperCase() : String.fromCharCode(65 + index);
      } else if (option && typeof option === 'object') {
        text = option.text ?? option.label ?? option.optionText ?? option.value ?? option.title ?? `Option ${index + 1}`;
        const rawKey = option.key ?? option.value ?? option.id ?? String.fromCharCode(65 + index);
        key = String(rawKey).trim().toUpperCase();
        icon = option.icon;
      } else {
        text = `Option ${index + 1}`;
        key = String.fromCharCode(65 + index);
      }

      const normalizedText = typeof text === 'string' ? text.trim() || `Option ${index + 1}` : String(text || `Option ${index + 1}`);
      let normalizedKey = key ? String(key).trim().toUpperCase() : String.fromCharCode(65 + index);
      if (!normalizedKey) normalizedKey = String.fromCharCode(65 + index);

      if (seenKeys.has(normalizedKey)) {
        let suffix = 2;
        let candidate = `${normalizedKey}-${suffix}`;
        while (seenKeys.has(candidate)) {
          suffix += 1;
          candidate = `${normalizedKey}-${suffix}`;
        }
        normalizedKey = candidate;
      }

      seenKeys.add(normalizedKey);

      return {
        key: normalizedKey,
        displayKey: index < 26 ? String.fromCharCode(65 + index) : String(index + 1),
        text: normalizedText,
        icon,
      };
    })
    : [];
}

const OPTION_COLORS = {
  A: { base: '#60A5FA', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.35)', glow: 'rgba(96,165,250,0.2)' },
  B: { base: '#A78BFA', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.35)', glow: 'rgba(167,139,250,0.2)' },
  C: { base: '#34D399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.35)', glow: 'rgba(52,211,153,0.2)' },
  D: { base: '#FB923C', bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.35)', glow: 'rgba(251,146,60,0.2)' },
  E: { base: '#F472B6', bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.35)', glow: 'rgba(244,114,182,0.2)' },
};

export default function MCQQuestion({ question, value, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(null);
  const options = normalizeQuestionOptions(question.options);

  function cleanDisplayText(option) {
    const text = option.text || '';
    const disp = option.displayKey || '';
    if (!disp) return text;
    try {
      const esc = disp.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const re = new RegExp(`^${esc}[\\s\\.:-]+`, 'i');
      return String(text).replace(re, '').trim();
    } catch (e) {
      return String(text).trim();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
    >
      {options.map((option, i) => {
        const selected = value === option.key;
        const isHov = hovered === option.key;
        const colors = OPTION_COLORS[option.key] || OPTION_COLORS.A;
        const active = selected || isHov;

        return (
          <motion.div
            key={option.key}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
            onMouseEnter={() => setHovered(option.key)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => !readOnly && onChange(option.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1.1rem 1.4rem',
              background: selected
                ? colors.bg
                : isHov
                  ? 'rgba(255,255,255,0.04)'
                  : 'rgba(22,32,50,0.7)',
              border: selected
                ? `1.5px solid ${colors.border}`
                : isHov
                  ? '1px solid rgba(255,255,255,0.12)'
                  : '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              cursor: readOnly ? 'not-allowed' : 'pointer',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: selected
                ? `0 0 28px ${colors.glow}, 0 8px 24px rgba(0,0,0,0.2)`
                : isHov
                  ? '0 8px 24px rgba(0,0,0,0.2)'
                  : '0 2px 12px rgba(0,0,0,0.15)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* selected shimmer line */}
            {selected && (
              <div
                style={{
                  position: 'absolute', top: 0, left: '5%', right: '5%', height: '1px',
                  background: `linear-gradient(90deg, transparent, ${colors.base}80, transparent)`,
                }}
              />
            )}

            {/* Key badge */}
            <div
              style={{
                width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                background: selected
                  ? colors.base
                  : `${colors.base}18`,
                border: `1.5px solid ${selected ? colors.base : colors.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.25s ease',
                boxShadow: selected ? `0 0 14px ${colors.glow}` : 'none',
              }}
            >
              <span
                style={{
                  fontSize: '13px', fontWeight: 800,
                  color: selected ? '#fff' : colors.base,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {option.displayKey}
              </span>
            </div>

            {/* Option text */}
            <span
              style={{
                fontSize: '14px', fontWeight: selected ? 600 : 400,
                color: selected ? '#F8FAFC' : active ? '#CBD5E1' : '#94A3B8',
                lineHeight: 1.55,
                transition: 'all 0.25s ease',
                flex: 1,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {cleanDisplayText(option)}
            </span>

            {/* Check icon when selected */}
            {selected && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ flexShrink: 0 }}
              >
                <div
                  style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: colors.base,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 12px ${colors.glow}`,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Selection status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '0.25rem', paddingLeft: '0.25rem' }}>
        <motion.div
          animate={{
            background: value ? '#4ADE80' : '#334155',
            boxShadow: value ? '0 0 8px rgba(74,222,128,0.6)' : 'none',
          }}
          transition={{ duration: 0.3 }}
          style={{ width: '7px', height: '7px', borderRadius: '50%' }}
        />
        <span style={{ fontSize: '12px', fontWeight: 500, color: value ? '#4ADE80' : '#475569', transition: 'color 0.3s ease' }}>
          {value ? `Option ${options.find((opt) => opt.key === value)?.displayKey || value} selected` : 'Select one option to continue'}
        </span>
      </div>
    </motion.div>
  );
}