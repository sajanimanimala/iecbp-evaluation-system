'use client';
export default function ScoreComparisonCard({ ai, human }) {
    const finalHuman = human || {};
    const finalAI = ai || {};
    const humanSum = Math.round(((finalHuman.understanding || 0) + (finalHuman.awareness || 0) + (finalHuman.decision || 0) + (finalHuman.clarity || 0)) / 4);
    const aiSum = finalAI.overall || Math.round(((finalAI.understanding || 0) + (finalAI.awareness || 0) + (finalAI.decision || 0) + (finalAI.clarity || 0)) / 4);
    const final = Math.round((aiSum + humanSum) / 2);

    return (
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#111827] to-[#0f172a] border border-white/10 text-center">
            <div className="text-slate-400 text-sm">AI</div>
            <div className="text-2xl font-bold text-cyan-300">{aiSum}</div>
            <div className="text-slate-400 text-sm mt-2">Human</div>
            <div className="text-2xl font-bold text-indigo-300">{humanSum}</div>
            <div className="text-slate-200 mt-3">Final <span className="font-extrabold ml-2">{final}</span></div>
        </div>
    );
}
