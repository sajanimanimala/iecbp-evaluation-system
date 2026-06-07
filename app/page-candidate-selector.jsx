'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const scenarios = [
  {
    id: 1,
    title: 'Emergency Decision Overload in Healthcare Systems',
    category: 'Healthcare Operations',
    level: 'Advanced',
    levelColor: '#EF4444',
    summary: 'Critical hospital decisions under operational pressure and rapidly changing emergency situations.',
    description: 'Many hospitals handle continuous patient inflow, emergency cases, limited ICU beds, staff shortages, and rapidly changing medical conditions simultaneously. Doctors and nurses must make life-critical decisions under time pressure while balancing patient priority, resource availability, and incomplete information. Over time, the accumulation of hidden operational stress and unpredictable emergencies makes effective decision-making increasingly difficult.',
    icon: '🏥',
    accent: '#6366F1',
    questions: 10,
    minutes: 45,
  },
  {
    id: 2,
    title: 'The Gap Between Social Media Popularity and Customer Loyalty',
    category: 'Marketing & Consumer Psychology',
    level: 'Intermediate',
    levelColor: '#3B82F6',
    summary: 'Understanding why viral popularity does not always create genuine customer loyalty.',
    description: 'A company invests heavily in influencer marketing, celebrity collaborations, and viral online campaigns to build a strong brand image among young customers. Within a few months, the brand dominates social media trends, gains millions of views and followers, and becomes widely recognized across digital platforms. Despite the massive online popularity and constant engagement, the company notices that customer trust remains weak, repeat purchases stay low, and long-term loyalty fails to improve.',
    icon: '📣',
    accent: '#3B82F6',
    questions: 10,
    minutes: 45,
  },
  {
    id: 3,
    title: 'The Growing Impact of Uncontrolled Financial Decisions',
    category: 'Financial Decision-Making',
    level: 'Beginner',
    levelColor: '#4ADE80',
    summary: 'Managing financial imbalance caused by gradual emotional and operational spending pressures.',
    description: 'A family carefully plans monthly expenses, savings, education costs, medical needs, and future financial goals based on their current income. However, unexpected repairs, rising living costs, emergencies, social obligations, and lifestyle spending slowly disrupt the balance. Individually, each expense may seem manageable, but over time the combination creates financial pressure, reduced savings, and emotional stress.',
    icon: '💰',
    accent: '#60A5FA',
    questions: 10,
    minutes: 45,
  },
  {
    id: 4,
    title: 'Ride-Sharing Booking Synchronization Conflicts',
    category: 'System Design & User Experience',
    level: 'Advanced',
    levelColor: '#EF4444',
    summary: 'Resolving operational confusion caused by ride-booking synchronization failures.',
    description: 'A customer receives booking confirmation from one ride app while a driver from another app also receives confirmation. Inconsistent real-time booking states create confusion, operational conflict, and reduced platform trust.',
    icon: '🚗',
    accent: '#6366F1',
    questions: 10,
    minutes: 45,
  },
  {
    id: 5,
    title: 'The Disconnect Between Customer Data and Real Satisfaction',
    category: 'Customer Experience & Product Analytics',
    level: 'Intermediate',
    levelColor: '#3B82F6',
    summary: 'Analyzing why huge customer analytics still fail to capture real satisfaction.',
    description: 'Companies collect massive amounts of customer feedback, analytics, and behavioral data, yet customers still feel misunderstood because emotional frustration and real experience are difficult to measure using numbers alone.',
    icon: '📊',
    accent: '#7C3AED',
    questions: 10,
    minutes: 45,
  },
  {
    id: 6,
    title: 'The Unintended Consequences of Flexible Work-From-Home Policies',
    category: 'Workplace Collaboration & Productivity',
    level: 'Beginner',
    levelColor: '#4ADE80',
    summary: 'Exploring how flexible remote work policies can unintentionally reduce collaboration and productivity.',
    description: 'Flexible work-from-home systems initially improve employee happiness and comfort, but over time communication delays, weaker collaboration, and coordination issues begin affecting productivity and operational efficiency.',
    icon: '🏠',
    accent: '#60A5FA',
    questions: 10,
    minutes: 45,
  },
];

const timelineSteps = ['Scenario Briefing', 'Assessment', 'Review', 'Submit'];

export default function Home() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1623 0%, #121826 40%, #182235 70%, #1a2540 100%)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      overflowX: 'hidden',
      position: 'relative',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Ambient background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-5%',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '-10%',
          width: '700px', height: '700px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '40%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(96,165,250,0.04) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>

      <AnimatePresence mode="wait">
        {!selectedScenario ? (
          <motion.div key="dashboard"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            {/* NAVBAR */}
            <nav style={{
              position: 'sticky', top: 0, zIndex: 100,
              background: 'rgba(18,24,38,0.75)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(99,102,241,0.12)',
              padding: '0 2.5rem',
              height: '72px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
  <div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  flexShrink: 0,
}}>
  <img
    src="/logo.jpeg"
    alt="IE Logo"
    style={{
      width: '54px',
      height: '54px',
      objectFit: 'contain',
      filter: `
        drop-shadow(0 0 10px rgba(99,102,241,0.5))
        drop-shadow(0 0 20px rgba(124,58,237,0.35))
      `,
    }}
  />
</div>

  <div>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700, fontSize: '15px',
                    color: '#F8FAFC', letterSpacing: '-0.2px',
                  }}>IECBP Evaluation System</div>
                  <div style={{
                    fontSize: '11px', color: '#64748B',
                    fontWeight: 400, marginTop: '1px', letterSpacing: '0.2px',
                  }}>Scenario-Based Intelligent Assessment Platform</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {['6 Scenarios', '50 Min Assessment', 'Multimedia Enabled'].map((pill, i) => (
                  <div key={i} style={{
                    padding: '5px 14px', borderRadius: '999px',
                    background: 'rgba(99,102,241,0.08)',
                    border: '1px solid rgba(99,102,241,0.18)',
                    fontSize: '12px', color: '#94A3B8', fontWeight: 500,
                    letterSpacing: '0.2px', whiteSpace: 'nowrap',
                  }}>{pill}</div>
                ))}
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginLeft: '0.5rem', cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(99,102,241,0.3)',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              </div>
            </nav>

            {/* HEADER */}
            <div style={{
              padding: '3.5rem 2.5rem 2rem',
              maxWidth: '1280px', margin: '0 auto',
              textAlign: 'center',
            }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '6px 16px', borderRadius: '999px',
                  background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  marginBottom: '1.5rem',
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366F1', boxShadow: '0 0 8px #6366F1' }} />
                  <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500, letterSpacing: '0.5px' }}>INTELLIGENT EVALUATION PLATFORM</span>
                </div>

                <h1 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                  fontWeight: 700, color: '#F8FAFC',
                  margin: '0 0 1rem', lineHeight: 1.2,
                  letterSpacing: '-0.5px',
                }}>
                  Choose Your{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #818CF8, #7C3AED, #60A5FA)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>Evaluation Scenario</span>
                </h1>

                <p style={{
                  fontSize: '1rem', color: '#94A3B8', lineHeight: 1.75,
                  maxWidth: '620px', margin: '0 auto',
                  fontWeight: 400,
                }}>
                  Interactive scenario-based assessments designed to evaluate critical thinking, prioritization, situational awareness, and decision-making.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '2rem', marginTop: '2rem',
                }}
              >
                {[
                  { label: 'Total Scenarios', value: '6' },
                  { label: 'Questions Each', value: '10' },
                  { label: 'Duration', value: '50 Min' },
                ].map((stat, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F8FAFC' }}>{stat.value}</div>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500, letterSpacing: '0.5px', marginTop: '2px' }}>{stat.label.toUpperCase()}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* SCENARIO GRID */}
            <div style={{
              maxWidth: '1280px', margin: '0 auto',
              padding: '0 2.5rem 4rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '1.5rem',
            }}>
              {scenarios.map((s, i) => (
                <ScenarioCard
                  key={s.id}
                  scenario={s}
                  index={i}
                  isHovered={hoveredCard === s.id}
                  onHover={() => setHoveredCard(s.id)}
                  onLeave={() => setHoveredCard(null)}
                  onClick={() => setSelectedScenario(s)}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <ScenarioBriefing
            key="briefing"
            scenario={selectedScenario}
            onBack={() => setSelectedScenario(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ScenarioCard({ scenario, index, isHovered, onHover, onLeave, onClick }) {
  const levelAccent =
    scenario.level === 'Beginner'
      ? '#4ADE80'
      : scenario.level === 'Intermediate'
      ? '#3B82F6'
      : '#F97316';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        background: isHovered
          ? 'linear-gradient(145deg, #25354F, #2B3C59)'
          : 'linear-gradient(145deg, #1B273A, #22314A)',
        boxShadow: isHovered
          ? `0 25px 70px rgba(0,0,0,0.45), 0 0 60px ${levelAccent}55, 0 0 120px ${levelAccent}25`
          : '0 4px 24px rgba(0,0,0,0.2)',
        borderRadius: '20px',
        padding: '1.75rem',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: isHovered
          ? `1px solid ${levelAccent}50`
          : '1px solid rgba(255,255,255,0.06)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        position: 'relative', overflow: 'hidden',
      }}
      onClick={onClick}
    >
      <div style={{
        position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
        background: isHovered
          ? `linear-gradient(90deg, transparent, ${levelAccent}60, transparent)`
          : 'transparent',
        transition: 'all 0.3s ease',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px',
          background: `linear-gradient(135deg, ${scenario.accent}20, ${scenario.accent}10)`,
          border: `1px solid ${scenario.accent}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px',
          boxShadow: isHovered ? `0 0 20px ${scenario.accent}25` : 'none',
          transition: 'box-shadow 0.3s ease',
        }}>
          {scenario.icon}
        </div>
        <div style={{
          padding: '4px 12px', borderRadius: '999px', fontSize: '11px',
          fontWeight: 600, letterSpacing: '0.5px',
          background:
            scenario.level === 'Beginner' ? 'rgba(74,222,128,0.12)'
            : scenario.level === 'Intermediate' ? 'rgba(59,130,246,0.12)'
            : 'rgba(249,115,22,0.12)',
          border:
            scenario.level === 'Beginner' ? '1px solid rgba(74,222,128,0.25)'
            : scenario.level === 'Intermediate' ? '1px solid rgba(59,130,246,0.25)'
            : '1px solid rgba(249,115,22,0.25)',
          color: levelAccent,
        }}>
          {scenario.level.toUpperCase()}
        </div>
      </div>

      <div style={{
        fontSize: '11px', fontWeight: 600, letterSpacing: '0.6px',
        color: levelAccent, marginBottom: '0.5rem',
      }}>
        {scenario.category.toUpperCase()}
      </div>

      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.05rem', fontWeight: 700,
        color: '#F8FAFC', lineHeight: 1.4, margin: '0 0 0.75rem',
      }}>
        {scenario.title}
      </h3>

      <p style={{
        fontSize: '13px', color: '#CBD5E1',
        lineHeight: 1.65, margin: '0 0 1.25rem',
      }}>
        {scenario.summary}
      </p>

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 0 1rem' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px',
            background: 'rgba(99,102,241,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#CBD5E1' }}>{scenario.questions}</div>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 500 }}>Questions</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px',
            background: 'rgba(96,165,250,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#CBD5E1' }}>5 Mins / Q</div>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 500 }}>Duration</div>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: '100%', padding: '11px 0',
          borderRadius: '12px', border: 'none', cursor: 'pointer',
          background: isHovered
            ? `linear-gradient(135deg, ${levelAccent}, ${levelAccent}cc)`
            : 'rgba(99,102,241,0.12)',
          color: isHovered ? '#fff' : '#94A3B8',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '13px', fontWeight: 600, letterSpacing: '0.3px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          transition: 'all 0.3s ease',
          boxShadow: isHovered ? `0 0 25px ${levelAccent}40` : 'none',
        }}
      >
        Continue to Scenario
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </motion.button>
    </motion.div>
  );
}

function ScenarioBriefing({ scenario, onBack }) {
  const router = useRouter();
  const [activeStep] = useState(0);

  const handleStartAssessment = () => {
    router.push(`/assessment/scenario${scenario.id}`);
  };

  return (
    <motion.div
      key="briefing"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}
    >
      {/* Briefing Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(18,24,38,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99,102,241,0.12)',
        padding: '0 2.5rem',
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(124,58,237,0.15))',
            border: '1.5px solid rgba(99,102,241,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99,102,241,0.2)',
          }}>
            <span style={{
              fontWeight: 700, fontSize: '11px',
              background: 'linear-gradient(135deg, #a5b4fc, #7c3aed)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>IE</span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#CBD5E1' }}>IECBP Evaluation System</span>
        </div>
        <div style={{
          padding: '4px 12px', borderRadius: '999px',
          background: 'rgba(99,102,241,0.1)',
          border: '1px solid rgba(99,102,241,0.2)',
          fontSize: '12px', color: '#818CF8', fontWeight: 500,
        }}>
          Scenario Briefing Mode
        </div>
      </nav>

      {/* 3-column layout */}
      <div style={{
        maxWidth: '1340px', margin: '0 auto',
        padding: '2.5rem 2rem',
        display: 'grid',
        gridTemplateColumns: '220px 1fr 280px',
        gap: '1.75rem',
        alignItems: 'start',
      }}>
        {/* LEFT: Timeline */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            background: 'linear-gradient(145deg, #1E2A40, #24324A)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px',
            padding: '1.75rem',
            position: 'sticky', top: '84px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.7px', color: '#64748B', marginBottom: '1.5rem' }}>
            EVALUATION PROGRESS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {timelineSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                    background: i === activeStep
                      ? 'linear-gradient(135deg, #6366F1, #7C3AED)'
                      : i < activeStep ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.04)',
                    border: i === activeStep
                      ? 'none'
                      : i < activeStep ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: i === activeStep ? '0 0 20px rgba(99,102,241,0.4)' : 'none',
                    transition: 'all 0.3s ease',
                  }}>
                    {i < activeStep ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <span style={{
                        fontSize: '12px', fontWeight: 700,
                        color: i === activeStep ? '#fff' : '#475569',
                      }}>{i + 1}</span>
                    )}
                  </div>
                  {i < timelineSteps.length - 1 && (
                    <div style={{
                      width: '1px', height: '40px',
                      background: i < activeStep
                        ? 'linear-gradient(180deg, #6366F1, #6366F130)'
                        : 'rgba(255,255,255,0.06)',
                      margin: '4px 0',
                    }} />
                  )}
                </div>
                <div style={{ paddingTop: '6px' }}>
                  <div style={{
                    fontSize: '13px', fontWeight: i === activeStep ? 600 : 400,
                    color: i === activeStep ? '#F8FAFC' : i < activeStep ? '#6366F1' : '#475569',
                    transition: 'color 0.3s ease',
                  }}>{step}</div>
                  {i === activeStep && (
                    <div style={{ fontSize: '11px', color: '#6366F1', marginTop: '2px', fontWeight: 500 }}>Current Stage</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '2rem', padding: '1rem',
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: '12px',
          }}>
            <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px', fontWeight: 500 }}>ACTIVE SCENARIO</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1', lineHeight: 1.4 }}>
              {scenario.title.substring(0, 50)}{scenario.title.length > 50 ? '…' : ''}
            </div>
            <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
              <span style={{
                fontSize: '10px', padding: '3px 8px', borderRadius: '999px',
                background: 'rgba(99,102,241,0.12)', color: '#818CF8', fontWeight: 600,
              }}>{scenario.questions}Q</span>
              <span style={{
                fontSize: '10px', padding: '3px 8px', borderRadius: '999px',
                background: 'rgba(96,165,250,0.12)', color: '#60A5FA', fontWeight: 600,
              }}>5 Mins / Q</span>
            </div>
          </div>
        </motion.div>

        {/* CENTER: Briefing Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 14px', borderRadius: '999px',
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            marginBottom: '1.25rem',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366F1', boxShadow: '0 0 8px #6366F1' }} />
            <span style={{ fontSize: '11px', color: '#818CF8', fontWeight: 600, letterSpacing: '0.5px' }}>SCENARIO BRIEFING</span>
          </div>

          <div style={{
            background: 'linear-gradient(145deg, #1E2A40, #24324A)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)',
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: `linear-gradient(135deg, ${scenario.accent}20, ${scenario.accent}10)`,
                border: `1px solid ${scenario.accent}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '26px',
                boxShadow: `0 0 30px ${scenario.accent}20`,
              }}>
                {scenario.icon}
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.6px', color: scenario.accent, marginBottom: '4px' }}>
                  {scenario.category.toUpperCase()}
                </div>
                <span style={{
                  padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                  background:
                    scenario.level === 'Beginner' ? 'rgba(74,222,128,0.1)'
                    : scenario.level === 'Intermediate' ? 'rgba(59,130,246,0.1)'
                    : 'rgba(249,115,22,0.1)',
                  border:
                    scenario.level === 'Beginner' ? '1px solid rgba(74,222,128,0.25)'
                    : scenario.level === 'Intermediate' ? '1px solid rgba(59,130,246,0.25)'
                    : '1px solid rgba(249,115,22,0.25)',
                  color: scenario.levelColor,
                }}>{scenario.level}</span>
              </div>
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)',
              fontWeight: 700, color: '#F8FAFC',
              lineHeight: 1.3, margin: '0 0 1.5rem',
              letterSpacing: '-0.3px',
            }}>
              {scenario.title}
            </h2>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 0 1.5rem' }} />

            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.6px', color: '#475569', marginBottom: '0.75rem' }}>
              SCENARIO OVERVIEW
            </div>

            <p style={{ fontSize: '15px', color: '#CBD5E1', lineHeight: 1.85, margin: '0 0 2rem' }}>
              {scenario.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { icon: '🧩', label: 'Total Questions', value: `${scenario.questions} Questions`, color: '#6366F1' },
                { icon: '⏱️', label: 'Time Limit', value: '5 Mins / Question', color: '#60A5FA' },
              ].map((m, i) => (
                <div key={i} style={{
                  padding: '1rem 1.25rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                  <span style={{ fontSize: '20px' }}>{m.icon}</span>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, letterSpacing: '0.4px', marginBottom: '2px' }}>
                      {m.label.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: m.color }}>{m.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartAssessment}
              style={{
                flex: 1, padding: '14px 24px',
                background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
                border: 'none', borderRadius: '14px', cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '14px', fontWeight: 700,
                color: '#fff', letterSpacing: '0.3px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 8px 30px rgba(99,102,241,0.3)',
              }}
            >
              Start Assessment
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              style={{
                padding: '14px 24px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px', cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '14px', fontWeight: 600,
                color: '#94A3B8', letterSpacing: '0.3px',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to Scenarios
            </motion.button>
          </div>
        </motion.div>

        {/* RIGHT: Instructions Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{ position: 'sticky', top: '84px' }}
        >
          <div style={{
            background: 'linear-gradient(145deg, #1E2A40, #24324A)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px',
            padding: '1.75rem',
            marginBottom: '1rem',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.4), transparent)',
            }} />

            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.7px', color: '#64748B', marginBottom: '1.25rem' }}>
              ASSESSMENT INSTRUCTIONS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: '🎯', title: 'One Question at a Time', desc: 'Each question is presented individually for focused evaluation.' },
                { icon: '↩️', title: 'Edit Previous Answers', desc: 'You can revise earlier answers only while each question’s 5-minute timer is still active; after it expires, that question will no longer be accessible.' },
                { icon: '⚠️', title: 'Answer Required', desc: 'You cannot proceed to the next question without responding.' },
                { icon: '⏳', title: 'Timer Active', desc: 'Each question gets 5 minutes only.' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '0.75rem',
                  padding: '0.875rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                }}>
                  <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '3px' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            marginTop: '1rem', padding: '0.95rem 1rem',
            borderRadius: '14px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderLeft: '3px solid #60A5FA',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.45rem' }}>
              <span style={{ fontSize: '14px' }}>💡</span>
              <span style={{ color: '#60A5FA', fontSize: '11px', fontWeight: 700, letterSpacing: '0.8px' }}>PRO TIP</span>
            </div>
            <div style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.6 }}>
              Think through the scenario before making your choice.
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}