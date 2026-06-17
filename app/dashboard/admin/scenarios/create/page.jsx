'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// ── CONSTANTS ────────────────────────────────────────────────────────────────

const QUESTION_TYPES = [
  { value: 'mcq',            label: 'MCQ',                   icon: '🔘', color: '#A78BFA' },
  { value: 'short_text',     label: 'Short Text',            icon: '✏️', color: '#60A5FA' },
  { value: 'yes_no',         label: 'Yes / No + Reasoning',  icon: '❓', color: '#F472B6' },
  { value: 'audio',          label: 'Audio Response',        icon: '🎧', color: '#34D399' },
  { value: 'video',          label: 'Video Response',        icon: '🎬', color: '#FB923C' },
  { value: 'multi_select',   label: 'Multi Select',          icon: '☑️', color: '#818CF8' },
  { value: 'drag_rank',      label: 'Drag & Drop Ranking',   icon: '↕️', color: '#F59E0B' },
  { value: 'multi_image',    label: 'Multi Select + Image',  icon: '🖼️', color: '#38BDF8' },
];

const CATEGORIES = [
  'Healthcare Operations',
  'Marketing & Consumer Psychology',
  'Financial Decision-Making',
  'System Design & User Experience',
  'Customer Experience & Product Analytics',
  'Workplace Collaboration & Productivity',
  'Other',
];
const SCENARIO_ICONS = [
  "🏥",
  "💰",
  "📈",
  "💻",
  "🛒",
  "🏢",
  "🎯",
  "🧩",
];
const TYPE_META = {
  mcq:          { color: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)' },
  short_text:   { color: '#60A5FA', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.3)'  },
  yes_no:       { color: '#F472B6', bg: 'rgba(244,114,182,0.1)', border: 'rgba(244,114,182,0.3)' },
  audio:        { color: '#34D399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.3)'  },
  video:        { color: '#FB923C', bg: 'rgba(251,146,60,0.1)',  border: 'rgba(251,146,60,0.3)'  },
  multi_select: { color: '#818CF8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.3)' },
  drag_rank:    { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)'  },
  multi_image:  { color: '#38BDF8', bg: 'rgba(56,189,248,0.1)',  border: 'rgba(56,189,248,0.3)'  },
};

function makeQuestion(number) {
  return {
    id: Date.now() + Math.random(),
    number,
    type: 'short_text',
    text: '',
    options: [],
    rankItems: [],
  };
}

function makeOption() {
  return { id: Date.now() + Math.random(), text: '', imageUrl: '' };
}

// ── SHARED INPUT STYLES ──────────────────────────────────────────────────────

const inputBase = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'rgba(15,22,35,0.6)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '11px 14px',
  color: '#F8FAFC',
  fontSize: '13px',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  outline: 'none',
  transition: 'border 0.2s ease, box-shadow 0.2s ease',
};

function InputField({ label, value, onChange, placeholder, multiline, rows = 3, required }) {
  const [focused, setFocused] = useState(false);
  const style = {
    ...inputBase,
    border: focused ? '1.5px solid rgba(99,102,241,0.6)' : '1px solid rgba(255,255,255,0.08)',
    boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
    resize: multiline ? 'vertical' : 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', letterSpacing: '0.5px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {label.toUpperCase()}{required && <span style={{ color: '#F87171', marginLeft: '3px' }}>*</span>}
        </label>
      )}
      {multiline ? (
        <textarea
          value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} rows={rows}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={style}
        />
      ) : (
        <input
          type="text" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={style}
        />
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', letterSpacing: '0.5px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label.toUpperCase()}</label>}
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          ...inputBase,
          border: focused ? '1.5px solid rgba(99,102,241,0.6)' : '1px solid rgba(255,255,255,0.08)',
          boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
          paddingRight: '36px',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt} style={{ background: '#1E2A40', color: '#F8FAFC' }}>
            {opt.label || opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function SmallButton({ children, onClick, color = '#6366F1', icon }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '6px 12px', borderRadius: '8px',
        background: `${color}15`, border: `1px solid ${color}35`,
        color, fontSize: '12px', fontWeight: 600, cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {icon && icon}{children}
    </motion.button>
  );
}

// ── TYPE-SPECIFIC FIELDS ─────────────────────────────────────────────────────

function MCQFields({ options, setOptions }) {
  const addOption = () => setOptions([...options, makeOption()]);
  const removeOption = (id) => setOptions(options.filter((o) => o.id !== id));
  const updateOption = (id, text) => setOptions(options.map((o) => o.id === id ? { ...o, text } : o));

  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', letterSpacing: '0.5px', marginBottom: '8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>OPTIONS</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
        {options.map((opt, i) => (
          <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#A78BFA' }}>{String.fromCharCode(65 + i)}</span>
            </div>
            <input
              type="text" value={opt.text} placeholder={`Option ${String.fromCharCode(65 + i)}`}
              onChange={(e) => updateOption(opt.id, e.target.value)}
              style={{ ...inputBase, flex: 1, padding: '8px 12px' }}
            />
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => removeOption(opt.id)}
              style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </motion.button>
          </div>
        ))}
      </div>
      <SmallButton onClick={addOption} color="#A78BFA" icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}>Add Option</SmallButton>
    </div>
  );
}

function MultiSelectFields({ options, setOptions }) {
  const addOption = () => setOptions([...options, makeOption()]);
  const removeOption = (id) => setOptions(options.filter((o) => o.id !== id));
  const updateOption = (id, text) => setOptions(options.map((o) => o.id === id ? { ...o, text } : o));

  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', letterSpacing: '0.5px', marginBottom: '8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>SELECTABLE OPTIONS</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
        {options.map((opt, i) => (
          <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.3)', flexShrink: 0 }} />
            <input type="text" value={opt.text} placeholder={`Option ${i + 1}`} onChange={(e) => updateOption(opt.id, e.target.value)} style={{ ...inputBase, flex: 1, padding: '8px 12px' }} />
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => removeOption(opt.id)}
              style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </motion.button>
          </div>
        ))}
      </div>
      <SmallButton onClick={addOption} color="#818CF8" icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}>Add Option</SmallButton>
    </div>
  );
}

function DragRankFields({ options, setOptions }) {
  const addItem = () => setOptions([...options, makeOption()]);
  const removeItem = (id) => setOptions(options.filter((o) => o.id !== id));
  const updateItem = (id, text) => setOptions(options.map((o) => o.id === id ? { ...o, text } : o));

  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', letterSpacing: '0.5px', marginBottom: '8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>RANKING ITEMS</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
        {options.map((opt, i) => (
          <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#F59E0B' }}>#{i + 1}</span>
            </div>
            <input type="text" value={opt.text} placeholder={`Ranking item ${i + 1}`} onChange={(e) => updateItem(opt.id, e.target.value)} style={{ ...inputBase, flex: 1, padding: '8px 12px' }} />
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => removeItem(opt.id)}
              style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </motion.button>
          </div>
        ))}
      </div>
      <SmallButton onClick={addItem} color="#F59E0B" icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}>Add Ranking Item</SmallButton>
    </div>
  );
}

function MultiImageFields({ options, setOptions }) {
  const addOption = () => setOptions([...options, makeOption()]);
  const removeOption = (id) => setOptions(options.filter((o) => o.id !== id));
  const updateOption = (id, field, val) => setOptions(options.map((o) => o.id === id ? { ...o, [field]: val } : o));

  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', letterSpacing: '0.5px', marginBottom: '8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>OPTIONS WITH IMAGE</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
        {options.map((opt, i) => (
          <div key={opt.id} style={{ background: 'rgba(56,189,248,0.04)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '12px', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#38BDF8' }}>{String.fromCharCode(65 + i)}</span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748B', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Option {String.fromCharCode(65 + i)}</span>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => removeOption(opt.id)}
                style={{ marginLeft: 'auto', width: '26px', height: '26px', borderRadius: '7px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </motion.button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <input type="text" value={opt.text} placeholder="Option text" onChange={(e) => updateOption(opt.id, 'text', e.target.value)} style={{ ...inputBase, padding: '8px 12px' }} />
              <input type="text" value={opt.imageUrl} placeholder="Image URL (e.g. /images/scenario2-q4.png)" onChange={(e) => updateOption(opt.id, 'imageUrl', e.target.value)} style={{ ...inputBase, padding: '8px 12px' }} />
            </div>
          </div>
        ))}
      </div>
      <SmallButton onClick={addOption} color="#38BDF8" icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}>Add Option with Image</SmallButton>
    </div>
  );
}

function MediaPlaceholder({ type }) {
  const isAudio = type === 'audio';
  const color = isAudio ? '#34D399' : '#FB923C';
  const bg = isAudio ? 'rgba(52,211,153,0.06)' : 'rgba(251,146,60,0.06)';
  const border = isAudio ? 'rgba(52,211,153,0.2)' : 'rgba(251,146,60,0.2)';
  return (
    <div style={{ padding: '16px', background: bg, border: `1px dashed ${border}`, borderRadius: '12px', textAlign: 'center' }}>
      <div style={{ fontSize: '22px', marginBottom: '6px' }}>{isAudio ? '🎧' : '🎬'}</div>
      <div style={{ fontSize: '12px', fontWeight: 600, color, marginBottom: '3px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {isAudio ? 'Audio File' : 'Video File'}
      </div>
      <div style={{ fontSize: '11px', color: '#475569', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {isAudio
          ? 'Place audio at: public/audios/your-file.mp3'
          : 'Place video at: public/videos/your-file.mp4'}
      </div>
      <input type="text" placeholder={isAudio ? 'Audio file path e.g. /audios/scenario1-q5.mp3' : 'Video file path e.g. /videos/scenario1-q8.mp4'}
        style={{ ...inputBase, marginTop: '10px', padding: '8px 12px', textAlign: 'center' }} />
    </div>
  );
}

// ── QUESTION CARD ─────────────────────────────────────────────────────────────

function QuestionCard({ q, index, onUpdate, onRemove }) {
  const meta = TYPE_META[q.type] || TYPE_META.short_text;
  const typeLabel = QUESTION_TYPES.find((t) => t.value === q.type)?.label || q.type;

  const setOptions = (opts) => onUpdate({ ...q, options: opts });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'linear-gradient(145deg, #1E2A40, #24324A)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      }}
    >
      {/* Card header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 1.25rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(99,102,241,0.35)', flexShrink: 0,
          }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff' }}>Q{index + 1}</span>
          </div>
          <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '10px', fontWeight: 600, background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {typeLabel.toUpperCase()}
          </span>
        </div>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onRemove}
          style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.5">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          </svg>
        </motion.button>
      </div>

      {/* Card body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Question text */}
        <InputField label="Question Text" required value={q.text} onChange={(val) => onUpdate({ ...q, text: val })}
          placeholder="Enter the question…" multiline rows={3} />

        {/* Type selector */}
        <SelectField label="Question Type" value={q.type}
          onChange={(val) => onUpdate({ ...q, type: val, options: [], rankItems: [] })}
          options={QUESTION_TYPES.map((t) => ({ value: t.value, label: `${t.icon}  ${t.label}` }))} />

        {/* Type-specific fields */}
        <AnimatePresence mode="wait">
          <motion.div key={q.type} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {(q.type === 'mcq') && (
              <MCQFields options={q.options} setOptions={setOptions} />
            )}
            {(q.type === 'multi_select') && (
              <MultiSelectFields options={q.options} setOptions={setOptions} />
            )}
            {(q.type === 'drag_rank') && (
              <DragRankFields options={q.options} setOptions={setOptions} />
            )}
            {(q.type === 'multi_image') && (
              <MultiImageFields options={q.options} setOptions={setOptions} />
            )}
            {(q.type === 'audio') && <MediaPlaceholder type="audio" />}
            {(q.type === 'video') && <MediaPlaceholder type="video" />}
            {(q.type === 'yes_no') && (
              <div style={{ padding: '10px 14px', background: 'rgba(244,114,182,0.06)', border: '1px solid rgba(244,114,182,0.15)', borderRadius: '10px' }}>
                <div style={{ fontSize: '12px', color: '#94A3B8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  This question shows a <span style={{ color: '#F472B6', fontWeight: 600 }}>Yes / No</span> choice followed by a reasoning textarea. No options needed.
                </div>
              </div>
            )}
            {(q.type === 'short_text') && (
              <div style={{ padding: '10px 14px', background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: '10px' }}>
                <div style={{ fontSize: '12px', color: '#94A3B8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  This question shows a <span style={{ color: '#60A5FA', fontWeight: 600 }}>textarea</span> for open-ended response. No options needed.
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function CreateScenarioPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [questions, setQuestions] = useState([makeQuestion(1)]);
  const [level, setLevel] = useState("Beginner");
  const [icon, setIcon] = useState("🧩");
  const [showSuccess, setShowSuccess] = useState(false);

  const addQuestion = () => {
    setQuestions((prev) => [...prev, makeQuestion(prev.length + 1)]);
  };

  const removeQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id).map((q, i) => ({ ...q, number: i + 1 })));
  };

  const updateQuestion = (id, updated) => {
    setQuestions((prev) => prev.map((q) => q.id === id ? updated : q));
  };

 const handleSave = async () => {
  try {
    const formData = {
      name,
      description,
      category: category === "Other" ? customCategory : category,
      icon,
      level,
levelColor:
  level === "Beginner"
    ? "#22C55E"
    : level === "Intermediate"
    ? "#F59E0B"
    : "#EF4444",
      questions: questions.map((q) => ({
        number: q.number,
        type: q.type,
        text: q.text,
        options: q.options,
      })),
    };

    const response = await fetch("/api/admin/scenarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to save scenario");
    }

   setShowSuccess(true);

setTimeout(() => {
  router.push("/dashboard/admin/scenarios");
}, 2000);
  } catch (error) {
    console.error(error);
    alert("Failed to create scenario");
  }
};

  return (
    <>
  {showSuccess && (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: '450px',
          background: 'linear-gradient(145deg, #1E2A40, #24324A)',
          border: '1px solid rgba(34,197,94,0.25)',
          borderRadius: '24px',
          padding: '32px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ fontSize: '60px', marginBottom: '16px' }}>
          ✅
        </div>

        <h2
          style={{
            color: '#F8FAFC',
            marginBottom: '10px',
          }}
        >
          Scenario Created Successfully
        </h2>

        <p
          style={{
            color: '#94A3B8',
            lineHeight: '1.6',
          }}
        >
          The scenario has been saved and is now available in the evaluation system.
        </p>
      </div>
    </div>
  )}
  <div style={{ maxWidth: '860px' }}>
      {/* PAGE HEADER */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '999px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '0.75rem' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366F1', boxShadow: '0 0 8px #6366F1' }} />
          <span style={{ fontSize: '11px', color: '#818CF8', fontWeight: 600, letterSpacing: '0.5px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>SCENARIO MANAGEMENT</span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.85rem', fontWeight: 700, color: '#F8FAFC', margin: '0 0 4px', letterSpacing: '-0.3px' }}>Create Scenario</h1>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create a new assessment scenario with questions and question types.</p>
      </motion.div>

      {/* SCENARIO INFORMATION */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
        style={{ background: 'linear-gradient(145deg, #1E2A40, #24324A)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366F1', boxShadow: '0 0 8px rgba(99,102,241,0.8)' }} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>Scenario Information</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <InputField label="Scenario Name" required value={name} onChange={setName} placeholder="e.g. Emergency Decision Overload in Healthcare Systems" />
          <InputField label="Scenario Description" required value={description} onChange={setDescription} placeholder="Describe what this scenario is about and what candidates will evaluate…" multiline rows={4} />
          <SelectField label="Scenario Category" value={category} onChange={setCategory} options={CATEGORIES} />
          {category === "Other" && (
  <InputField
    label="Custom Category"
    value={customCategory}
    onChange={setCustomCategory}
    placeholder="Enter custom category"
  />
)}
<SelectField
  label="Scenario Level"
  value={level}
  onChange={setLevel}
  options={[
    "Beginner",
    "Intermediate",
    "Advanced"
  ]}
/>
<InputField
  label="Scenario Icon (Emoji)"
  value={icon}
  onChange={setIcon}
  placeholder="🏥"
/>
        </div>
      </motion.div>

      {/* QUESTION BUILDER */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366F1', boxShadow: '0 0 8px rgba(99,102,241,0.8)' }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
              Question Builder
            </h2>
            <span style={{ padding: '2px 10px', borderRadius: '999px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', fontSize: '11px', color: '#818CF8', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
            </span>
          </div>
          <motion.button whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(99,102,241,0.3)' }} whileTap={{ scale: 0.97 }}
            onClick={addQuestion}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', background: 'linear-gradient(135deg, #6366F1, #7C3AED)', border: 'none', borderRadius: '11px', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', fontWeight: 700, color: '#fff', boxShadow: '0 4px 16px rgba(99,102,241,0.25)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Question
          </motion.button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <AnimatePresence mode="popLayout">
            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                q={q}
                index={i}
                onUpdate={(updated) => updateQuestion(q.id, updated)}
                onRemove={() => removeQuestion(q.id)}
              />
            ))}
          </AnimatePresence>

          {/* Add question CTA at bottom of list */}
          <motion.div
            whileHover={{ borderColor: 'rgba(99,102,241,0.4)' }}
            onClick={addQuestion}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '1rem', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '16px', cursor: 'pointer', transition: 'border 0.2s ease' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <span style={{ fontSize: '13px', color: '#475569', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Add another question</span>
          </motion.div>
        </div>
      </motion.div>

      {/* BOTTOM ACTIONS */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
        style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 28px rgba(99,102,241,0.4)' }} whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #6366F1, #7C3AED)', border: 'none', borderRadius: '14px', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 6px 24px rgba(99,102,241,0.3)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Save Scenario
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => router.back()}
          style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Cancel
        </motion.button>
      </motion.div>
    </div>
    </>
  );
}