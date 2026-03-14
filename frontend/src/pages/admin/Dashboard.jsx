import { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, CreditCard, Bell, Activity, TrendingUp, Calculator } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

function StatCard({ label, value, icon: Icon, cls, accent }) {
  return (
    <div className={`stat-card ${cls}`} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', marginBottom: '10px' }}>{label}</p>
          <div style={{ fontFamily: 'var(--font-display, Syne, sans-serif)', fontSize: '36px', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
        </div>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `color-mix(in srgb, ${accent} 10%, transparent)`, border: `1px solid ${accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={accent} />
        </div>
      </div>
      <div style={{ height: '3px', background: 'var(--bg-surface)', borderRadius: '100px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: '70%', background: `linear-gradient(90deg, ${accent}, transparent)`, borderRadius: '100px', animation: 'slideIn .8s ease .2s both' }} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/admin').then(r => setStats(r.data.stats)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><div className="spinner" style={{ width: 36, height: 36 }} /></div>;

  const ACTIONS = [
    { label: 'Add Student', icon: GraduationCap, to: '/admin/students', color: 'var(--accent-1)' },
    { label: 'Add Faculty', icon: Users, to: '/admin/faculty', color: 'var(--accent-2)' },
    { label: 'New Course', icon: BookOpen, to: '/admin/courses', color: 'var(--accent-3)' },
    { label: 'Post Notice', icon: Bell, to: '/admin/notices', color: 'var(--accent-4)' },
    { label: 'Fee Record', icon: CreditCard, to: '/admin/fees', color: 'var(--accent-r)' },
    { label: 'CGPA Calc', icon: Calculator, to: '/admin/cgpa', color: 'var(--accent-1)' },
  ];

  const CAT_COLOR = { urgent: 'badge-rose', exam: 'badge-amber', academic: 'badge-violet', event: 'badge-green', general: 'badge-cyan' };

  return (
    <div className="animate-fade">
      {/* Welcome */}
      <div style={{ marginBottom: '28px', position: 'relative', padding: '28px 32px', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, var(--accent-1), var(--accent-2), var(--accent-1))' }} />
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <h1 style={{ fontSize: '26px', marginBottom: '6px' }}>
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Here's what's happening in your institution today.</p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
          <span className="badge badge-accent">Admin Portal</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '3px 10px', background: 'var(--bg-surface)', borderRadius: '100px', border: '1px solid var(--border-subtle)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4 stagger-1" style={{ marginBottom: '24px' }}>
        <StatCard label="Total Students" value={stats?.totalStudents || 0} icon={GraduationCap} cls="sc1" accent="var(--accent-1)" />
        <StatCard label="Faculty Members" value={stats?.totalFaculty || 0} icon={Users} cls="sc2" accent="var(--accent-2)" />
        <StatCard label="Active Courses" value={stats?.totalCourses || 0} icon={BookOpen} cls="sc3" accent="var(--accent-3)" />
        <StatCard label="Pending Fees" value={`₹${((stats?.pendingFees || 0)/1000).toFixed(0)}K`} icon={CreditCard} cls="sc4" accent="var(--accent-4)" />
      </div>

      <div className="grid-2 stagger-2">
        {/* Notices */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '16px' }}>Recent Notices</h3>
            <span className="badge badge-accent" style={{ fontSize: '9px' }}>● LIVE</span>
          </div>
          {(stats?.recentNotices || []).length === 0
            ? <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '24px' }}>No notices yet</p>
            : (stats?.recentNotices || []).map(n => (
              <div key={n._id} style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: '10px', marginBottom: '8px', borderLeft: '3px solid var(--accent-1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>{n.title}</p>
                  <span className={`badge ${CAT_COLOR[n.category] || 'badge-accent'}`} style={{ fontSize: '9px', flexShrink: 0 }}>{n.category}</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {n.postedBy?.name} • {new Date(n.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 style={{ fontSize: '16px', marginBottom: '18px' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {ACTIONS.map(a => (
              <Link key={a.label} to={a.to} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 14px', background: 'var(--bg-surface)',
                borderRadius: '12px', border: '1px solid var(--border-subtle)',
                textDecoration: 'none', color: 'var(--text-secondary)',
                fontSize: '13px', fontWeight: '500', transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${a.color}40`; e.currentTarget.style.color = a.color; e.currentTarget.style.background = `color-mix(in srgb, ${a.color} 6%, var(--bg-surface))`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}>
                <a.icon size={15} />
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
