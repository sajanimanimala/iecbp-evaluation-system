'use client';
export default function EvaluationActions({ editable, setEditable, onSave, onApprove, onReject }) {
    return (
        <div className="rounded-2xl p-4 bg-gradient-to-br from-[#0f172a] to-[#111827] border border-white/10 space-y-3">
            <div className="flex items-center gap-3">
                <button onClick={() => setEditable(e => !e)} className="px-4 py-2 rounded-lg bg-slate-800/40 border border-white/6 text-slate-200">{editable ? 'Cancel Edit' : 'Modify'}</button>
                <button onClick={onSave} className="px-4 py-2 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-semibold">Save Changes</button>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={onApprove} className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white font-bold">Approve Evaluation</button>
                <button onClick={onReject} className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold">Reject Evaluation</button>
            </div>
        </div>
    );
}
