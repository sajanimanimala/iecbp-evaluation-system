'use client';
import { useState, useMemo } from 'react';

export default function SubmissionTable({ submissions, onView }) {
    const [q, setQ] = useState('');
    const [status, setStatus] = useState('all');
    const [sortDir, setSortDir] = useState('desc');

    const filtered = useMemo(() => {
        let list = submissions.slice();
        if (q) {
            const s = q.toLowerCase();
            list = list.filter(su => (su.candidateName + ' ' + su.scenario).toLowerCase().includes(s));
        }
        if (status !== 'all') list = list.filter(su => su.status === status);
        list.sort((a, b) => sortDir === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date));
        return list;
    }, [submissions, q, status, sortDir]);

    return (
        <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0f172a] to-[#111827] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-3 flex-1">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search candidate or scenario"
                        className="flex-1 px-4 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-sm text-slate-300"
                    />
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-slate-900/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300">
                        <option value="all">All status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="modified">Modified</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')} className="px-3 py-2 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-semibold">Sort: {sortDir}</button>
                </div>
            </div>

            <div className="overflow-auto">
                <table className="w-full text-left table-auto">
                    <thead>
                        <tr className="text-slate-400 text-sm">
                            <th className="py-3 pr-4">Candidate</th>
                            <th className="py-3 pr-4">Scenario</th>
                            <th className="py-3 pr-4">Submission Date</th>
                            <th className="py-3 pr-4">AI Score</th>
                            <th className="py-3 pr-4">Status</th>
                            <th className="py-3 pr-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(s => (
                            <tr key={s.id} className="border-t border-white/6">
                                <td className="py-4 pr-4"><div className="font-semibold text-white">{s.candidateName}</div><div className="text-slate-400 text-sm">{s.email || ''}</div></td>
                                <td className="py-4 pr-4 text-slate-300">{s.scenario}</td>
                                <td className="py-4 pr-4 text-slate-300">{new Date(s.date).toLocaleString()}</td>
                                <td className="py-4 pr-4"><div className="inline-flex items-center gap-2"><div className="font-semibold text-white">{s.aiScore}</div><div className="text-slate-400 text-sm">/100</div></div></td>
                                <td className="py-4 pr-4"><StatusBadge status={s.status} /></td>
                                <td className="py-4 pr-4"><button onClick={() => onView(s)} className="px-3 py-2 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 text-white font-semibold">View Review</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const map = {
        pending: 'bg-yellow-600/20 text-yellow-300 border border-yellow-400/20',
        approved: 'bg-green-600/10 text-green-300 border border-green-400/20',
        modified: 'bg-indigo-600/10 text-indigo-300 border border-indigo-400/20',
        rejected: 'bg-red-600/10 text-red-300 border border-red-400/20',
    };
    const cls = map[status] || 'bg-slate-800/30 text-slate-300 border border-white/6';
    return <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${cls}`}>{status?.toUpperCase()}</div>;
}
