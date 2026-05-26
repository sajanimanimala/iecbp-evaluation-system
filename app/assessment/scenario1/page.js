'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AssessmentShell from '../../../components/assessment/AssessmentShell';
import SubmitScreen from '../../../components/assessment/SubmitScreen';
import { scenario1Questions, scenario1Meta } from '../../../data/scenario1Questions';

export default function Scenario1Assessment() {
  const [phase, setPhase] = useState('assessment'); // 'assessment' | 'submit'
  const [answers, setAnswers] = useState({});
  const [attemptId, setAttemptId] = useState(null);

  const router = useRouter();
  useEffect(() => {
    const startExamAttempt = async () => {
      const res = await fetch('/api/assessment/start', {
        method: 'POST'
      });

      const data = await res.json();
      console.log("START API RESPONSE FULL:", JSON.stringify(data));
      setAttemptId(data.attemptId);
      console.log("Scenario attemptId set:", data.attemptId);
    };

    startExamAttempt();

  }, []);


  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleFinish = async () => {
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenarioId: scenario1Meta.id,
          answers,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (!attemptId) {
          alert("Exam session not initialized. Refresh and try again.");
          return;
        }

        setPhase('submit');
      } else {
        alert('Failed to save submission');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  const handleRestart = () => {
    window.location.href = '/';
  };
  const handleBackToAssessment = () => {
    setPhase('assessment');
  };
  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f1623 0%, #121826 40%, #182235 70%, #1a2540 100%)',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      {/* font import */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ambient orbs — same as dashboard */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div
          style={{
            position: 'absolute', top: '-10%', left: '-5%',
            width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: '10%', right: '-10%',
            width: '700px', height: '700px',
            background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {phase === 'assessment' ? (
            <motion.div
              key="assessment"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <AssessmentShell
                meta={scenario1Meta}
                questions={scenario1Questions}
                answers={answers}
                onAnswer={handleAnswer}
                onFinish={handleFinish}
              />
            </motion.div>
          ) : (
            <motion.div
              key="submit"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SubmitScreen
                meta={scenario1Meta}
                questions={scenario1Questions}
                answers={answers}
                onRestart={handleRestart}
                onBack={handleBackToAssessment}
                attemptId={attemptId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}