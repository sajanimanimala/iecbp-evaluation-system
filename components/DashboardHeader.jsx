"use client";
import React from 'react';
import ProfileMenu from './ProfileMenu';

export default function DashboardHeader() {
    return (
        <header style={{
            position: 'sticky', top: 0, zIndex: 100,
            background: 'rgba(18,24,38,0.75)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            padding: '10px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            height: '72px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="/logo.jpeg" alt="IECBP" style={{ width: 44, height: 44, objectFit: 'contain' }} />
                <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC' }}>IECBP Evaluation System</div>
                    <div style={{ fontSize: 12, color: '#94A3B8' }}>Scenario-Based Candidate Evaluation Platform</div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button aria-label="Notifications" style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)', color: '#94A3B8' }}>Notifications</button>
                <ProfileMenu />
            </div>
        </header>
    );
}
