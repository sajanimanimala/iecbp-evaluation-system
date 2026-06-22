'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import AssessmentShell from '../../../components/assessment/AssessmentShell';
import SubmitScreen from '../../../components/assessment/SubmitScreen';

import {
  scenario1Questions,
  scenario1Meta,
} from '../../../data/scenario1Questions';

export default function Scenario1Assessment() {

  const [phase, setPhase] = useState('assessment');

  const [answers, setAnswers] = useState({});

  const [attemptId, setAttemptId] = useState(null);

  const [questionTimings, setQuestionTimings] = useState({});

  const [started, setStarted] = useState(false);

  const router = useRouter();

  useEffect(() => {

    if (started) return;

    const startExamAttempt = async () => {

      try {

        setStarted(true);

        const res = await fetch('/api/assessment/start', {
          method: 'POST',
        });

        const data = await res.json();

        console.log("START API RESPONSE:", data);

        setAttemptId(data.attemptId);
        sessionStorage.setItem('iecbp_attemptId', String(data.attemptId));
        console.log("ATTEMPT CREATED AT PAGE (scenario1):", data.attemptId);
        console.log("ATTEMPT ID STORED:", data.attemptId);

      } catch (error) {

        console.error("Start attempt failed:", error);

      }
    };

    startExamAttempt();

  }, [started]);

  const handleAnswer = (questionId, value) => {

    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

  };

  const handleFinish = async (data) => {

    try {

      console.log("HANDLE FINISH CALLED");

      setQuestionTimings(data.questionTimings);

      console.log("ATTEMPT ID USED (scenario1 handleFinish):", attemptId);
      const response = await fetch('/api/submissions', {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({

          attemptId,

          scenarioId: scenario1Meta.id,

          answers: data.answers,

          questionTimings: data.questionTimings,

        }),
      });

      const result = await response.json();

      console.log("SUBMISSION RESPONSE:", result);

      if (result.success) {

        setPhase('submit');

      } else {

        alert('Failed to save submission');

      }

    } catch (error) {

      console.error("Submission error:", error);

      alert('Something went wrong');

    }
  };

  const handleRestart = () => {

    window.location.href = '/dashboard/candidate';

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

      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div style={{ position: 'relative', zIndex: 1 }}>

        <AnimatePresence mode="wait">

          {phase === 'assessment' ? (

            <motion.div
              key="assessment"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >

              <SubmitScreen
                meta={scenario1Meta}
                questions={scenario1Questions}
                answers={answers}
                questionTimings={questionTimings}
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
