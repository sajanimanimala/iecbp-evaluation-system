"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchSession, getAuthUser, redirectPathForRole } from '../../../components/auth/auth';
import DashboardHeader from '../../../components/DashboardHeader';

export default function AdminPage() {
    const router = useRouter();
    const [user, setUser] = useState(() => getAuthUser());
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ users: 0, scenarios: 0, responses: 0 });

    useEffect(() => {
        let mounted = true;

        async function init() {
            setLoading(true);
            const sessionUser = await fetchSession();
            if (!sessionUser) {
                router.replace('/login');
                return;
            }
            const u = sessionUser;
            if (u.role !== 'ADMIN') {
                router.replace(redirectPathForRole(u.role));
                return;
            }
            if (mounted) setUser(u);

            try {
                const res = await fetch('/api/admin/stats');
                if (res.ok) {
                    const data = await res.json();
                    if (data.ok) {
                        if (mounted) setStats({ users: data.usersCount || 0, scenarios: data.scenariosCount || 0, responses: data.submissionsCount || 0 });
                    }
                }
            } catch (e) { }

            setLoading(false);
        }

        init();
        return () => { mounted = false; };
    }, [router]);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6">
            <DashboardHeader />

            <div className="mt-6 mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <div className="text-sm text-slate-400">Administrator panel</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-[#071018] to-[#0b1722] rounded-lg border border-white/5">
                    <div className="text-sm text-slate-400">Total Users</div>
                    <div className="text-2xl font-bold text-white">{stats.users}</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-[#071018] to-[#0b1722] rounded-lg border border-white/5">
                    <div className="text-sm text-slate-400">Total Scenarios</div>
                    <div className="text-2xl font-bold text-white">{stats.scenarios}</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-[#071018] to-[#0b1722] rounded-lg border border-white/5">
                    <div className="text-sm text-slate-400">Total Responses</div>
                    <div className="text-2xl font-bold text-white">{stats.responses}</div>
                </div>
            </div>
        </div>
    );
}