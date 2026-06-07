'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    exact: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Scenarios',
    href: '/admin/scenarios',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    label: 'Candidates',
    href: '/admin/candidates',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: 'Evaluators',
    href: '/admin/evaluators',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <polyline points="9 11 12 14 22 4" />
      </svg>
    ),
  },
  {
    label: 'Submissions',
    href: '/admin/submissions',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    label: 'Results',
    href: '/admin/results',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="18 20 22 16 18 12" />
        <line x1="2" y1="16" x2="22" y2="16" />
        <polyline points="6 4 2 8 6 12" />
        <line x1="2" y1="8" x2="22" y2="8" />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (item) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <div style={{
      width: '240px',
      minHeight: '100vh',
      flexShrink: 0,
      background: 'linear-gradient(180deg, #0f1623 0%, #121826 50%, #182235 100%)',
      borderRight: '1px solid rgba(99,102,241,0.12)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0, left: 0,
      zIndex: 50,
    }}>
      {/* Logo area */}
      <div style={{
        padding: '1.5rem 1.25rem',
        borderBottom: '1px solid rgba(99,102,241,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            overflow: 'hidden', flexShrink: 0,
            border: '2.5px solid #1a3560',
          }}>
            <Image
              src="/logo.jpeg"
              alt="txrV.ed"
              width={38}
              height={38}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div>
            <div style={{
              fontSize: '13px', fontWeight: 700,
              color: '#F8FAFC', letterSpacing: '-0.2px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              IECBP Admin
            </div>
            <div style={{ fontSize: '10px', color: '#475569', fontWeight: 400 }}>
              Control Panel
            </div>
          </div>
        </div>
      </div>

      {/* Section label */}
      <div style={{ padding: '1.25rem 1.25rem 0.5rem' }}>
        <span style={{
          fontSize: '10px', fontWeight: 600,
          letterSpacing: '0.8px', color: '#475569',
        }}>
          NAVIGATION
        </span>
      </div>

      {/* Nav items */}
      <nav style={{ padding: '0 0.75rem', flex: 1 }}>
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ x: 3 }}
                transition={{ duration: 0.15 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.7rem 0.875rem',
                  borderRadius: '12px',
                  marginBottom: '4px',
                  background: active
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(124,58,237,0.12))'
                    : 'transparent',
                  border: active
                    ? '1px solid rgba(99,102,241,0.3)'
                    : '1px solid transparent',
                  color: active ? '#818CF8' : '#64748B',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: active ? '0 0 16px rgba(99,102,241,0.12)' : 'none',
                  position: 'relative',
                }}
              >
                {/* active indicator bar */}
                {active && (
                  <div style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: '3px', borderRadius: '0 2px 2px 0',
                    background: 'linear-gradient(180deg, #6366F1, #7C3AED)',
                    boxShadow: '0 0 8px rgba(99,102,241,0.6)',
                  }} />
                )}

                <span style={{ color: active ? '#818CF8' : '#475569', flexShrink: 0 }}>
                  {item.icon}
                </span>

                <span style={{
                  fontSize: '13px',
                  fontWeight: active ? 600 : 400,
                  color: active ? '#F8FAFC' : '#64748B',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: 'color 0.2s ease',
                }}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom — back to platform */}
      <div style={{ padding: '1rem 0.75rem 1.5rem' }}>
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '1rem' }} />
        <Link href="/" style={{ textDecoration: 'none' }}>
          <motion.div
            whileHover={{ x: 3 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.7rem 0.875rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span style={{
              fontSize: '12px', fontWeight: 500,
              color: '#475569',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Back to Platform
            </span>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}