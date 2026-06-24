'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardHeader from '../../../../../../components/DashboardHeader';
import EvaluatorReportDashboard from '../../../../../../components/EvaluatorReportDashboard';

export default function EvaluatorReportPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.submissionId;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const approveReport = async (action) => {
    try {
      const res = await fetch('/api/reports/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: report.id, action }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Report ${action} Successfully`);
        router.push('/dashboard/evaluator');
      } else {
        alert(data.message || 'Action Failed');
      }
    } catch (error) {
      console.error(error);
      alert('Action Failed');
    }
  };

  useEffect(() => {
    async function loadReport() {
      try {
        const res = await fetch(`/api/reports/submission/${submissionId}`);
        const data = await res.json();
        if (data.success) {
          setReport(data.report);
        }
      } catch (error) {
        console.error('REPORT LOAD ERROR:', error);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [submissionId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1623 0%, #121826 40%, #182235 70%, #1a2540 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#94A3B8' }}>Loading report...</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1623 0%, #121826 40%, #182235 70%, #1a2540 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#FECACA' }}>Report not found</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1623 0%, #121826 40%, #182235 70%, #1a2540 100%)', color: '#E2E8F0', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <DashboardHeader />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 2rem 4rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.5rem' }}>Evaluation Report</h1>
          <p style={{ margin: 0, color: '#94A3B8', fontSize: '14px' }}>Submission #{submissionId}</p>
        </div>

        <EvaluatorReportDashboard 
          report={report} 
          submissionId={submissionId}
          showActions={true}
          onAction={approveReport}
        />

        <button
          onClick={() => router.push('/dashboard/evaluator')}
          style={{ marginTop: '2rem', padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(15,23,42,0.8)', color: '#E2E8F0', fontWeight: 700, cursor: 'pointer' }}
        >
          ← Back to Submissions
        </button>
      </div>
    </div>
  );
}
