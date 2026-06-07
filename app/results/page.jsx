'use client';

import { useEffect, useState } from 'react';

import ResultSummary from '../../components/assessment/evaluation/ResultSummary';
import ScoreChart from '../../components/assessment/evaluation/ScoreChart';
import FeedbackBox from '../../components/assessment/evaluation/FeedbackBox';
import SignalCard from '../../components/assessment/evaluation/SignalCard';

export default function ResultsPage() {

  const [result, setResult] = useState(null);

  useEffect(() => {

    const params =
      new URLSearchParams(window.location.search);

    const submissionId =
      params.get('submissionId');
    console.log("submissionId:", submissionId);

    async function fetchResults() {

      const res = await fetch(
        `/api/evaluation/results?submissionId=${submissionId}`
      );

      const data = await res.json();
      console.log("API data:", data);
      setResult(data.result);
    }

    fetchResults();

  }, []);

  if (!result) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071120] text-white text-2xl font-semibold">
        Loading Results...
      </div>
    );
  }

  return (

    <div className="min-h-screen relative overflow-hidden bg-[#071120] text-white px-6 py-10">

      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[140px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto">

        <ResultSummary result={result} />

        {/* Signal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

          <SignalCard
            title="Understanding"
            score={result.understanding}
          />

          <SignalCard
            title="Awareness"
            score={result.awareness}
          />

          <SignalCard
            title="Decision"
            score={result.decision}
          />

          <SignalCard
            title="Clarity"
            score={result.clarity}
          />

        </div>

        {/* Chart */}
        <div className="mt-10">

          <ScoreChart result={result} />

        </div>

        {/* Feedback */}
        <div className="mt-10">

          <FeedbackBox
            feedback={result.feedback}
          />

        </div>

      </div>

    </div>
  );
}