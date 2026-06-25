'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function resolveVideoSrc(question) {
  const candidate = question?.videoSrc
    ?? question?.videoUrl
    ?? question?.src
    ?? question?.url
    ?? question?.mediaUrl
    ?? question?.mediaSrc
    ?? question?.meta?.videoSrc
    ?? question?.config?.videoSrc;

  if (typeof candidate === 'string' && candidate.trim()) {
    return candidate.trim();
  }

  if (question?.scenarioId || question?.scenario_id) {
    const scenarioId = question.scenarioId ?? question.scenario_id;
    const questionNumber = question.number ?? question.orderNo;
    if (questionNumber) {
      return `/videos/scenario${scenarioId}-q${questionNumber}.mp4`;
    }
  }

  return '/videos/default.mp4';
}

export default function VideoQuestion({ question, value, onChange, readOnly = false }) {
  const [videoState, setVideoState] = useState('idle'); // idle | playing | paused | ended
  const [hasWatched, setHasWatched] = useState(Boolean(value?.watched));
  const [focused, setFocused] = useState(false);
  const videoRef = useRef(null);

  const answer = value?.response || '';
  const videoSrc = resolveVideoSrc(question);
  console.log('Video question raw:', question);
  console.log('Resolved videoSrc ->', videoSrc);
  const wordCount = answer ? answer.trim().split(/\s+/).filter(Boolean).length : 0;
  const isComplete = hasWatched && answer.trim().length > 0;

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setVideoState('playing');
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setVideoState('paused');
    }
  };

  const handleEnded = () => {
    setVideoState('ended');
    setHasWatched(true);
    onChange({ ...value, watched: true, response: answer });
  };

  const handleVideoClick = () => {
    if (videoState === 'playing') handlePause();
    else handlePlay();
  };

  const handleResponse = (text) => {
    if (readOnly) return;
    onChange({ ...value, watched: hasWatched, response: text });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── VIDEO PLAYER CARD ── */}
      <div style={{
        background: 'linear-gradient(145deg, #141e30, #1a2640)',
        border: '1px solid rgba(251,146,60,0.18)',
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: '1.5rem',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}>
        {/* top accent */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', zIndex: 2,
          background: 'linear-gradient(90deg, transparent, rgba(251,146,60,0.5), transparent)',
        }} />

        {/* header bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'rgba(251,146,60,0.12)',
              border: '1px solid rgba(251,146,60,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="2.5">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#FB923C', letterSpacing: '0.5px' }}>
                VIDEO SCENARIO
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
                Hospital Emergency Operations
              </div>
            </div>
          </div>

          {hasWatched && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <div style={{
                padding: '3px 10px', borderRadius: '999px',
                background: 'rgba(74,222,128,0.1)',
                border: '1px solid rgba(74,222,128,0.3)',
                fontSize: '11px', color: '#4ADE80', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '5px',
              }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 6px #4ADE80' }} />
                Watched
              </div>
            </motion.div>
          )}
        </div>

        {/* video container */}
        <div style={{
          position: 'relative', width: '100%',
          aspectRatio: '16/9', background: '#0a0f1a',
          cursor: 'pointer',
        }}
          onClick={handleVideoClick}
        >
          <video
            ref={videoRef}
            preload="metadata"
            controls
            playsInline
            src={videoSrc}
            onEnded={handleEnded}
            onPlay={() => setVideoState('playing')}
            onPause={() => setVideoState('paused')}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          {/* overlay for idle / paused / ended */}
          <AnimatePresence>
            {videoState !== 'playing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: 'absolute', inset: 0,
                  background: videoState === 'idle'
                    ? 'linear-gradient(145deg, rgba(10,15,26,0.92), rgba(20,30,48,0.85))'
                    : 'rgba(0,0,0,0.5)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: '1rem',
                }}
              >
                {/* play button */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    background: videoState === 'ended'
                      ? 'linear-gradient(135deg, #4ADE80, #059669)'
                      : 'linear-gradient(135deg, #FB923C, #EA580C)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: videoState === 'ended'
                      ? '0 0 40px rgba(74,222,128,0.4)'
                      : '0 0 40px rgba(251,146,60,0.4)',
                    cursor: 'pointer',
                  }}
                >
                  {videoState === 'ended' ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 .49-3.55" />
                    </svg>
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  )}
                </motion.div>

                {/* idle state info */}
                {videoState === 'idle' && (
                  <div style={{ textAlign: 'center', padding: '0 2rem' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.5rem' }}>
                      Watch the Scenario Video
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.6, maxWidth: '360px' }}>
                      {question.videoDescription}
                    </div>
                  </div>
                )}

                {videoState === 'ended' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#4ADE80' }}>
                      Video Complete — Watch again?
                    </div>
                  </div>
                )}

                {videoState === 'paused' && (
                  <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 500 }}>
                    Paused — click to resume
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* video placement note */}
        <div style={{
          padding: '0.875rem 1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span style={{ fontSize: '11px', color: '#475569', lineHeight: 1.5 }}>
            <span style={{ color: '#FB923C', fontWeight: 600 }}>Video file location: </span>
            {question.videoNote}
          </span>
        </div>
      </div>

      {/* ── RESPONSE TEXTAREA ── */}
      <div style={{
        background: 'linear-gradient(145deg, #1a2a42, #1e3050)',
        border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: '18px',
        padding: '1.5rem',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.6px', color: '#6366F1', marginBottom: '1rem' }}>
          YOUR ANALYSIS
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
              {isComplete
                ? 'Analysis recorded'
                : !hasWatched
                  ? 'Watch the video first, then share your analysis'
                  : 'Awaiting your analysis'}
            </span>
          </div>
          <span style={{ fontSize: '12px', color: '#64748B', fontVariantNumeric: 'tabular-nums' }}>
            {wordCount} words
          </span>
        </div>
      </div>
    </motion.div>
  );
}