'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function resolveAudioSrc(question) {
  const candidate = question?.audioSrc
    ?? question?.audioUrl
    ?? question?.src
    ?? question?.url
    ?? question?.mediaUrl
    ?? question?.mediaSrc
    ?? question?.meta?.audioSrc
    ?? question?.config?.audioSrc;

  if (typeof candidate === 'string' && candidate.trim()) {
    return candidate.trim();
  }

  if (question?.scenarioId || question?.scenario_id) {
    const scenarioId = question.scenarioId ?? question.scenario_id;
    const questionNumber = question.number ?? question.orderNo;
    if (questionNumber) {
      return `/audios/scenario${scenarioId}-q${questionNumber}.mp3`;
    }
  }

  return '/audios/default.mp3';
}

export default function AudioQuestion({ question, value, onChange, readOnly = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeLine, setActiveLine] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [focused, setFocused] = useState(false);
  const audioRef = useRef(null);
  const transcriptLines = Array.isArray(question.transcript) ? question.transcript : [];

  const audioSrc = resolveAudioSrc(question);
  console.log('audioSrc', audioSrc);

  const answer = value?.response || '';

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime || 0);

      if (!transcriptLines.length) return;

      const lineDuration = audio.duration > 0 ? audio.duration / transcriptLines.length : 4;
      const lineIndex = Math.floor((audio.currentTime || 0) / lineDuration);

      setActiveLine(
        lineIndex < transcriptLines.length
          ? lineIndex
          : transcriptLines.length - 1
      );
    };

    const loaded = () => {
      setDuration(audio.duration || 0);
      setCurrentTime(audio.currentTime || 0);
    };

    const ended = () => {
      setIsPlaying(false);
      setActiveLine(null);
      onChange({
        ...(value || {}),
        listened: true,
        response: answer,
      });
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', loaded);
    audio.addEventListener('ended', ended);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', loaded);
      audio.removeEventListener('ended', ended);
    };
  }, [answer, onChange, transcriptLines.length, value]);

  const hasListened = Boolean(value?.listened);
  const wordCount = answer ? answer.trim().split(/\s+/).filter(Boolean).length : 0;

  const lineDuration = duration && transcriptLines.length ? duration / transcriptLines.length : 4;
  const totalDuration = duration || 12;
  const progressPercent = (currentTime / totalDuration) * 100;

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Audio playback failed:', error);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    const newTime = pct * totalDuration;
    setCurrentTime(newTime);
    const lineIndex = Math.floor(newTime / lineDuration);
    setActiveLine(lineIndex < transcriptLines.length ? lineIndex : null);
  };

  const handleResponse = (text) => {
    if (readOnly) return;
    onChange({ ...value, listened: hasListened, response: text });
  };

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const isComplete = hasListened && answer.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <audio
        ref={audioRef}
        preload="metadata"
        controls
        playsInline
        src={audioSrc}
      >
        <source src={audioSrc} type="audio/mpeg" />
      </audio>
      {/* ── AUDIO PLAYER CARD ── */}
      <div style={{
        background: 'linear-gradient(145deg, #1a2a42, #1e3252)',
        border: '1px solid rgba(52,211,153,0.2)',
        borderRadius: '20px',
        padding: '1.75rem',
        marginBottom: '1.5rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* top accent */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.5), transparent)',
        }} />

        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'rgba(52,211,153,0.12)',
            border: '1px solid rgba(52,211,153,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#34D399', letterSpacing: '0.5px' }}>
              AUDIO SCENARIO
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
              Hospital Emergency — Staff Communication
            </div>
          </div>
          {hasListened && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ marginLeft: 'auto' }}
            >
              <div style={{
                padding: '3px 10px', borderRadius: '999px',
                background: 'rgba(74,222,128,0.1)',
                border: '1px solid rgba(74,222,128,0.3)',
                fontSize: '11px', color: '#4ADE80', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '5px',
              }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 6px #4ADE80' }} />
                Listened
              </div>
            </motion.div>
          )}
        </div>

        {/* waveform visual */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '3px',
          height: '40px', marginBottom: '1.25rem',
          padding: '0 0.25rem',
        }}>
          {Array.from({ length: 48 }).map((_, i) => {
            const heights = [20, 35, 55, 40, 65, 30, 45, 70, 35, 50, 25, 60, 45, 30, 55, 40, 65, 20, 50, 35, 70, 45, 30, 60, 25, 50, 40, 65, 30, 55, 45, 20, 60, 35, 50, 70, 25, 45, 55, 30, 65, 40, 20, 50, 35, 60, 45, 30];
            const h = heights[i % heights.length];
            const pct = (i / 47) * 100;
            const isPast = pct <= progressPercent;
            return (
              <motion.div
                key={i}
                animate={{
                  scaleY: isPlaying && isPast ? [1, 1.3, 1] : 1,
                  background: isPast ? '#34D399' : 'rgba(255,255,255,0.08)',
                }}
                transition={{
                  scaleY: { duration: 0.4, repeat: isPlaying && isPast ? Infinity : 0, repeatType: 'reverse', delay: i * 0.02 },
                  background: { duration: 0.1 },
                }}
                style={{
                  flex: 1, borderRadius: '2px',
                  height: `${h}%`,
                  transformOrigin: 'center',
                  boxShadow: isPast ? '0 0 4px rgba(52,211,153,0.4)' : 'none',
                }}
              />
            );
          })}
        </div>

        {/* seek bar */}
        <div
          onClick={handleSeek}
          style={{
            height: '4px', background: 'rgba(255,255,255,0.06)',
            borderRadius: '999px', cursor: 'pointer',
            marginBottom: '0.75rem', position: 'relative', overflow: 'hidden',
          }}
        >
          <motion.div
            style={{
              height: '100%', borderRadius: '999px',
              background: 'linear-gradient(90deg, #34D399, #6366F1)',
              boxShadow: '0 0 8px rgba(52,211,153,0.5)',
            }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* time */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '11px', color: '#64748B', fontVariantNumeric: 'tabular-nums' }}>
            {formatTime(currentTime)}
          </span>
          <span style={{ fontSize: '11px', color: '#64748B', fontVariantNumeric: 'tabular-nums' }}>
            {formatTime(totalDuration)}
          </span>
        </div>

        {/* controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          {/* rewind */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentTime(Math.max(0, currentTime - 5))}
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-3.55" />
            </svg>
          </motion.button>

          {/* play/pause */}
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: '0 0 30px rgba(52,211,153,0.4)' }}
            whileTap={{ scale: 0.94 }}
            onClick={togglePlay}
            style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #34D399, #059669)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px rgba(52,211,153,0.35)',
            }}
          >
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.svg key="pause"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                </motion.svg>
              ) : (
                <motion.svg key="play"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>

          {/* transcript toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowTranscript((s) => !s)}
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: showTranscript ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
              border: showTranscript ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.25s ease',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={showTranscript ? '#818CF8' : '#94A3B8'} strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </motion.button>
        </div>

        {/* hint */}
        {!hasListened && !isPlaying && currentTime === 0 && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ textAlign: 'center', fontSize: '12px', color: '#475569', marginTop: '1rem', marginBottom: 0 }}
          >
            Press play to listen to the hospital scenario conversation
          </motion.p>
        )}
      </div>

      {/* ── TRANSCRIPT ── */}
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            style={{ overflow: 'hidden', marginBottom: '1.5rem' }}
          >
            <div style={{
              background: 'rgba(15,22,35,0.7)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px',
              padding: '1.25rem',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.6px', color: '#475569', marginBottom: '1rem' }}>
                CONVERSATION TRANSCRIPT
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {transcriptLines.map((line, i) => {
                  const isActive = activeLine === i;
                  return (
                    <motion.div
                      key={i}
                      animate={{
                        background: isActive ? `${line.color}10` : 'transparent',
                        borderColor: isActive ? `${line.color}40` : 'transparent',
                      }}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid transparent',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div style={{
                        fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px',
                        color: line.color, marginBottom: '5px',
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}>
                        {isActive && (
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                            style={{ width: '6px', height: '6px', borderRadius: '50%', background: line.color }}
                          />
                        )}
                        {line.speaker.toUpperCase()}
                      </div>
                      <div style={{ fontSize: '13px', color: isActive ? '#F8FAFC' : '#94A3B8', lineHeight: 1.6, transition: 'color 0.3s ease' }}>
                        "{line.line}"
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RESPONSE TEXTAREA ── */}
      <div style={{
        background: 'linear-gradient(145deg, #1a2a42, #1e3050)',
        border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: '18px',
        padding: '1.5rem',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.6px', color: '#6366F1', marginBottom: '1rem' }}>
          YOUR RESPONSE
        </div>
        <div style={{ position: 'relative' }}>
          {focused && (
            <div style={{
              position: 'absolute', inset: '-2px', borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(124,58,237,0.1))',
              pointerEvents: 'none', zIndex: 0,
            }} />
          )}
          <textarea
            value={answer}
            onChange={(e) => handleResponse(e.target.value)}
            disabled={readOnly}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={question.placeholder}
            rows={5}
            style={{
              position: 'relative', zIndex: 1,
              width: '100%', boxSizing: 'border-box',
              background: focused ? 'rgba(28,40,62,0.98)' : 'rgba(18,28,46,0.8)',
              border: focused ? '1.5px solid rgba(99,102,241,0.55)' : '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px',
              padding: '1.1rem 1.3rem',
              color: '#F8FAFC', fontSize: '14px', lineHeight: '1.8',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              resize: 'vertical', outline: 'none',
              transition: 'all 0.3s ease',
              caretColor: '#818CF8',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <motion.div
              animate={{ background: isComplete ? '#4ADE80' : '#334155', boxShadow: isComplete ? '0 0 8px rgba(74,222,128,0.5)' : 'none' }}
              style={{ width: '6px', height: '6px', borderRadius: '50%' }}
            />
            <span style={{ fontSize: '12px', fontWeight: 500, color: isComplete ? '#4ADE80' : '#475569', transition: 'color 0.3s ease' }}>
              {isComplete ? 'Response recorded' : !hasListened ? 'Listen to audio first, then respond' : 'Awaiting your response'}
            </span>
          </div>
          <span style={{ fontSize: '12px', color: '#64748B', fontVariantNumeric: 'tabular-nums' }}>{wordCount} words</span>
        </div>
      </div>
    </motion.div>
  );
}