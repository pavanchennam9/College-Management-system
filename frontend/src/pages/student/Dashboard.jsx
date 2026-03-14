import { useState, useEffect } from 'react';
import { BookOpen, BarChart3, ClipboardList, CreditCard, TrendingUp } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { RadialBarChart, RadialBar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/student').then(r => setStats(r.data.stats)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" style={{ width: '32px', height: '32px' }} /></div>;

  const attPct = parseFloat(stats?.attendancePercentage || 0);
  const attColor = attPct >= 75 ? 'var(--neon-emerald)' : attPct >= 60 ? 'var(--neon-amber)' : 'var(--neon-rose)';

  return (
    <div className="animate-fade">
      <div className="page-header">
        <h1>My Dashboard</h1>
        <p>Welcome back, {user?.name}! Here's your academic overview.</p>
      </div>

      <div className="grid-4" style={{ marginBottom: '28px' }}>
        {[
          { label: 'Attendance', value: `${attPct}%`, icon: ClipboardList, color: 'cyan' },
          { label: 'CGPA', value: stats?.cgpa || '0.00', icon: TrendingUp, color: 'violet' },
          { label: 'Courses', value: stats?.totalGrades || 0, icon: BookOpen, color: 'emerald' },
          { label: 'Pending Fees', value: `₹${((stats?.pendingFees || 0) / 1000).toFixed(1)}K`, icon: CreditCard, color: 'amber' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', marginBottom: '8px' }}>{s.label}</p>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: '800' }}>{s.value}</div>
              </div>
              <div style={{ opacity: 0.3 }}><s.icon size={24} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Attendance Visual */}
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '20px' }}>Attendance Overview</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ width: '120px', height: '120px', position: 'relative', flexShrink: 0 }}>
              <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-surface)" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke={attColor} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - attPct / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '800', color: attColor }}>{attPct}%</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              {[
                { label: 'Classes Attended', value: stats?.presentClasses || 0, color: 'var(--neon-emerald)' },
                { label: 'Total Classes', value: stats?.totalClasses || 0, color: 'var(--neon-cyan)' },
                { label: 'Absent', value: (stats?.totalClasses - stats?.presentClasses) || 0, color: 'var(--neon-rose)' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: item.color }}>{item.value}</span>
                </div>
              ))}
              {attPct < 75 && <div style={{ padding: '8px 10px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 'var(--radius-sm)', fontSize: '11px', color: 'var(--neon-rose)' }}>⚠ Attendance below 75%</div>}
            </div>
          </div>
        </div>

        {/* Notices */}
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '20px' }}>Recent Notices</h3>
          {(stats?.recentNotices || []).length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No notices</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(stats?.recentNotices || []).map(n => (
                <div key={n._id} style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--neon-cyan)' }}>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px' }}>{n.title}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
