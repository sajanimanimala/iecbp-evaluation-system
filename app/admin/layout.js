import AdminSidebar from '../../components/admin/AdminSidebar';

export const metadata = {
  title: 'Admin — IECBP Evaluation System',
};

export default function AdminLayout({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1623 0%, #121826 40%, #182235 70%, #1a2540 100%)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      display: 'flex',
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Fixed sidebar */}
      <AdminSidebar />

      {/* Main content — offset by sidebar width */}
      <div style={{
        marginLeft: '240px',
        flex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Top bar */}
        <header style={{
          height: '60px',
          background: 'rgba(18,24,38,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(99,102,241,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#6366F1',
              boxShadow: '0 0 8px #6366F1',
            }} />
            <span style={{
              fontSize: '12px', color: '#64748B',
              fontWeight: 500, letterSpacing: '0.5px',
            }}>
              IECBP EVALUATION SYSTEM — ADMIN PANEL
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Admin badge */}
            <div style={{
              padding: '4px 12px', borderRadius: '999px',
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)',
              fontSize: '11px', color: '#818CF8', fontWeight: 600,
            }}>
              Admin
            </div>

            {/* Avatar */}
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 12px rgba(99,102,241,0.3)',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '2rem' }}>
          {children}
        </main>
      </div>
    </div>
  );
}