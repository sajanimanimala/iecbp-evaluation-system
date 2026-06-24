'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AssessmentShell from './AssessmentShell';
import SubmitScreen from './SubmitScreen';

function normalizeQuestion(question, index) {
  const normalizedType = question.questionType || question.type || 'short_text';
  const baseQuestion = {
    id: question.id,
    number: question.orderNo ?? question.number ?? index + 1,
    type: normalizedType,
    question: question.questionText || question.question || question.prompt || 'Untitled question',
  };

  const placeholder = question.placeholder || question.meta?.placeholder || question.config?.placeholder;
  if (placeholder) {
    baseQuestion.placeholder = placeholder;
  }

  const reasoningPlaceholder = question.reasoningPlaceholder || question.meta?.reasoningPlaceholder || question.config?.reasoningPlaceholder;
  if (reasoningPlaceholder) {
    baseQuestion.reasoningPlaceholder = reasoningPlaceholder;
  }

  const maxSelections = question.maxSelections ?? question.meta?.maxSelections ?? question.config?.maxSelections;
  if (maxSelections !== undefined) {
    baseQuestion.maxSelections = maxSelections;
  }

  const optionsSource = question.options || question.meta?.options || question.config?.options || question.choices || [];
  const mappedOptions = Array.isArray(optionsSource)
    ? optionsSource.map((option, optionIndex) => {
        if (typeof option === 'string') {
          return {
            key: String.fromCharCode(65 + optionIndex),
            text: option,
          };
        }

        if (option && typeof option === 'object') {
          return {
            key: option.key || String.fromCharCode(65 + optionIndex),
            text: option.optionText ?? option.text ?? option.label ?? option.value ?? `Option ${optionIndex + 1}`,
            icon: option.icon ?? undefined,
            imageUrl: option.imageUrl ?? undefined,
          };
        }

        return {
          key: String.fromCharCode(65 + optionIndex),
          text: `Option ${optionIndex + 1}`,
        };
      })
    : [];

  if (mappedOptions.length > 0) {
    baseQuestion.options = mappedOptions;
  }

  if (normalizedType === 'drag_rank' && mappedOptions.length > 0) {
    baseQuestion.items = mappedOptions.map((option, optionIndex) => ({
      id: String(optionIndex + 1),
      label: option.text,
      icon: option.icon ?? '🧩',
    }));
  }

  if (normalizedType === 'audio') {
    baseQuestion.audioSrc = question.audioSrc || question.audioUrl || question.meta?.audioSrc || question.config?.audioSrc || '/audios/default.mp3';
    baseQuestion.transcript = Array.isArray(question.transcript) ? question.transcript : [];
    baseQuestion.placeholder = baseQuestion.placeholder || 'Describe what you heard...';
  }

  if (normalizedType === 'video') {
    baseQuestion.videoSrc = question.videoSrc || question.videoUrl || question.meta?.videoSrc || question.config?.videoSrc || '/videos/default.mp4';
    baseQuestion.videoDescription = question.videoDescription || question.meta?.videoDescription || question.config?.videoDescription || 'Watch the scenario video to inform your response.';
    baseQuestion.videoNote = question.videoNote || question.meta?.videoNote || question.config?.videoNote || 'Scenario video reference';
    baseQuestion.placeholder = baseQuestion.placeholder || 'Describe what you observed...';
  }

  return baseQuestion;
}

export default function DynamicAssessmentClient({ scenario, questions }) {
  const router = useRouter();
  const [phase, setPhase] = useState('assessment');
  const [answers, setAnswers] = useState({});
  const [attemptId, setAttemptId] = useState(null);
  const [questionTimings, setQuestionTimings] = useState({});
  const [started, setStarted] = useState(false);

  const normalizedQuestions = [...questions]
    .sort((a, b) => (a.orderNo ?? 0) - (b.orderNo ?? 0))
    .map((question, index) => normalizeQuestion(question, index));

  useEffect(() => {
    if (started) return;

    const startExamAttempt = async () => {
      try {
        setStarted(true);
        const res = await fetch('/api/assessment/start', {
          method: 'POST',
        });

        const data = await res.json();
        setAttemptId(data.attemptId);
        sessionStorage.setItem('iecbp_attemptId', String(data.attemptId));
      } catch (error) {
        console.error('Start attempt failed:', error);
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
      setQuestionTimings(data.questionTimings);

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attemptId,
          scenarioId: scenario.id,
          answers: data.answers,
          questionTimings: data.questionTimings,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPhase('submit');
      } else {
        alert('Failed to save submission');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Something went wrong');
    }
  };

  const handleRestart = () => {
    router.push('/dashboard/candidate');
  };

  const handleBackToAssessment = () => {
    setPhase('assessment');
  };

  const meta = {
    id: scenario.id,
    title: scenario.title,
    category: scenario.category,
    level: scenario.level || 'Intermediate',
    totalQuestions: normalizedQuestions.length,
    minutes: 45,
    icon: scenario.icon || '🧩',
    accent: scenario.levelColor || '#6366F1',
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
                meta={meta}
                questions={normalizedQuestions}
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
                meta={meta}
                questions={normalizedQuestions}
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
