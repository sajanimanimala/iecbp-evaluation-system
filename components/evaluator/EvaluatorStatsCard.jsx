'use client';
export default function EvaluatorStatsCard({ title, value, subtitle, gradient }) {
    return (
        <div className="relative rounded-2xl p-6 bg-gradient-to-br from-[#0f172a] to-[#111827] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-lg">
            <div className="absolute -top-6 -right-8 w-48 h-48 bg-gradient-to-tr from-indigo-600/20 to-pink-500/10 blur-3xl rounded-full" />
            <div className="relative z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-medium text-slate-400">{title}</div>
                        <div className="text-3xl font-extrabold text-white mt-2">{value}</div>
                    </div>
                    <div className="text-sm text-slate-400">{subtitle}</div>
                </div>
            </div>
        </div>
    );
}
