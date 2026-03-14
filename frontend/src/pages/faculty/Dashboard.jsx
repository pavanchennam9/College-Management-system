import { useState, useEffect } from 'react';
import { BookOpen, Users, Bell } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/faculty').then(r => setStats(r.data.stats)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" style={{ width: '32px', height: '32px' }} /></div>;

  return (
    <div className="animate-fade">
      <div className="page-header">
        <h1>Welcome, {user?.name?.split(' ')[0]} 👋</h1>
        <p>Faculty Dashboard — {user?.department || 'Department'}</p>
      </div>

      <div className="grid-3" style={{ marginBottom: '28px' }}>
        <div className="stat-card cyan">
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', marginBottom: '8px' }}>My Courses</p>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: '800' }}>{stats?.totalCourses || 0}</div>
        </div>
        <div className="stat-card violet">
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', marginBottom: '8px' }}>Total Students</p>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: '800' }}>{stats?.totalStudents || 0}</div>
        </div>
        <div className="stat-card emerald">
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', marginBottom: '8px' }}>Emp. ID</p>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '800', color: 'var(--neon-emerald)' }}>{user?.employeeId || '—'}</div>
        </div>
      </div>

      <div className="grid-2">
        {/* My Courses */}
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '16px' }}>My Courses</h3>
          {(stats?.courses || []).length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No courses assigned</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(stats?.courses || []).map(c => (
                <div key={c._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0,229,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BookOpen size={16} color="var(--neon-cyan)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>{c.name}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.code} • {c.students?.length || 0} students</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notices */}
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '16px' }}>Recent Notices</h3>
          {(stats?.recentNotices || []).length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No notices</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(stats?.recentNotices || []).map(n => (
                <div key={n._id} style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--neon-cyan)' }}>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px' }}>{n.title}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>by {n.postedBy?.name} • {new Date(n.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
