'use client';
import { useState } from 'react';
import ScoreComparisonCard from './ScoreComparisonCard';
import EvidenceCard from './EvidenceCard';
import EvaluationActions from './EvaluationActions';
import ScoreChart from '../../components/assessment/evaluation/ScoreChart';

export default function ReviewPanel({ submission, onSave, onApprove, onReject }) {
    const [editable, setEditable] = useState(false);
    const [scores, setScores] = useState(() => ({
        understanding: submission?.ai?.understanding ?? 0,
        awareness: submission?.ai?.awareness ?? 0,
        decision: submission?.ai?.decision ?? 0,
        clarity: submission?.ai?.clarity ?? 0,
        overall: submission?.ai?.overall ?? 0,
    }));
    const [remarks, setRemarks] = useState('');

    if (!submission) return (
        <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0f172a] to-[#111827] border border-white/10">Select a submission to view details</div>
    );

    const questions = submission.questions || [];

    return (
        <div className="space-y-6">
            <div className="rounded-2xl p-6 bg-gradient-to-br from-[#132238] via-[#1b2440] to-[#311b45] border border-white/10">
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white">{submission.candidateName}</h3>
                        <div className="text-slate-400 text-sm">{submission.scenario} · {new Date(submission.date).toLocaleString()}</div>
                    </div>
                    <div className="w-48">
                        <ScoreComparisonCard ai={submission.ai} human={{ ...scores }} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-2 space-y-4">
                    <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0f172a] to-[#111827] border border-white/10">
                        <h4 className="text-lg font-semibold text-white mb-4">Questions & Answers</h4>
                        <div className="space-y-4">
                            {questions.map((q, i) => (
                                <div key={q.id} className="p-4 rounded-lg bg-slate-900/30 border border-white/6">
                                    <div className="font-semibold text-white">Q{i + 1}. {q.question}</div>
                                    <div className="text-slate-300 mt-2">{q.answer}</div>
                                    <div className="text-slate-400 text-sm mt-2">Time taken: {q.timeTaken}s · Validation: {q.valid ? 'OK' : 'Failed'}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0f172a] to-[#111827] border border-white/10">
                        <h4 className="text-lg font-semibold text-white mb-4">AI Evaluation</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="text-slate-300">Understanding <span className="font-bold text-white">{submission.ai.understanding}</span></div>
                                <div className="text-slate-300">Awareness <span className="font-bold text-white">{submission.ai.awareness}</span></div>
                                <div className="text-slate-300">Decision <span className="font-bold text-white">{submission.ai.decision}</span></div>
                                <div className="text-slate-300">Clarity <span className="font-bold text-white">{submission.ai.clarity}</span></div>
                            </div>
                            <div>
                                <ScoreChart result={submission.ai} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0f172a] to-[#111827] border border-white/10">
                        <h4 className="text-lg font-semibold text-white mb-4">Evidence</h4>
                        <div className="space-y-3">
                            {submission.evidence?.map((e, i) => <EvidenceCard key={i} signal={e.signal} evidence={e.text} />)}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0f172a] to-[#111827] border border-white/10">
                        <h4 className="text-lg font-semibold text-white mb-4">Human Evaluation</h4>
                        <div className="space-y-3">
                            {['understanding', 'awareness', 'decision', 'clarity'].map(key => (
                                <div key={key} className="flex items-center justify-between">
                                    <div className="text-slate-300 capitalize">{key}</div>
                                    <div>
                                        <input disabled={!editable} type="range" min="0" max="100" value={scores[key]} onChange={(e) => setScores(s => ({ ...s, [key]: Number(e.target.value) }))} />
                                        <div className="text-white font-semibold text-sm text-right">{scores[key]}</div>
                                    </div>
                                </div>
                            ))}

                            <div>
                                <label className="text-slate-300 block mb-2">Remarks</label>
                                <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full p-3 rounded-lg bg-slate-900/40 border border-white/6 text-slate-200" rows={5} />
                            </div>
                        </div>
                    </div>

                    <EvaluationActions editable={editable} setEditable={setEditable} onSave={() => onSave({ ...scores, remarks })} onApprove={() => onApprove(submission.id)} onReject={() => onReject(submission.id)} />
                </div>
            </div>
        </div>
    );
}
