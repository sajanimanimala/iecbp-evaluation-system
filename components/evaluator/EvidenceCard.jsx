'use client';
export default function EvidenceCard({ signal, evidence }) {
    return (
        <div className="p-3 rounded-lg bg-slate-900/30 border border-white/6">
            <div className="text-slate-400 text-sm">{signal}</div>
            <div className="text-slate-200 mt-2">{evidence}</div>
        </div>
    );
}
