"use client";
import LogoutButton from "../auth/LogoutButton";
import { useState } from "react";

export default function AdminHeader() {
    const [showMenu, setShowMenu] = useState(false);
  return (
    <div
  onClick={() => setShowMenu(!showMenu)}
  style={{
    cursor: 'pointer',
position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    }}>
        {showMenu && (
  <div
    style={{
      position: 'absolute',
      top: '45px',
      right: '0',
      width: '180px',
      background: '#121826',
      border: '1px solid rgba(99,102,241,0.2)',
      borderRadius: '12px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
      overflow: 'hidden',
      zIndex: 100,
    }}
  >
    <div
      style={{
        padding: '12px 16px',
        color: '#F8FAFC',
        fontSize: '13px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      Dashboard
    </div>

    <div
      style={{
        padding: '12px 16px',
        color: '#F8FAFC',
        fontSize: '13px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      Profile
    </div>

    <LogoutButton>
  <div
    style={{
      padding: '12px 16px',
      color: '#EF4444',
      fontSize: '13px',
      cursor: 'pointer',
    }}
  >
    Logout
  </div>
</LogoutButton>
  </div>
)}
      <div style={{
        padding: '4px 12px',
        borderRadius: '999px',
        background: 'rgba(99,102,241,0.1)',
        border: '1px solid rgba(99,102,241,0.2)',
        fontSize: '11px',
        color: '#818CF8',
        fontWeight: 600,
      }}>
        Admin
      </div>

      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 12px rgba(99,102,241,0.3)',
        cursor: 'pointer',
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
    </div>
  );
}