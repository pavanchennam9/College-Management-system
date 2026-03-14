import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function StudentAttendance() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/attendance/my').then(r => setSummary(r.data.summary)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" style={{ width: '32px', height: '32px' }} /></div>;

  return (
    <div className="animate-fade">
      <div className="page-header">
        <h1>My Attendance</h1>
        <p>Attendance summary per course</p>
      </div>

      {summary.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>No attendance records found</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {summary.map((s, i) => {
            const pct = parseFloat(s.percentage);
            const color = pct >= 75 ? 'var(--neon-emerald)' : pct >= 60 ? 'var(--neon-amber)' : 'var(--neon-rose)';
            return (
              <div key={i} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '4px' }}>{s.course.name}</h4>
                    <span className="badge badge-cyan">{s.course.code}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '900', color, lineHeight: 1 }}>{pct}%</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.present + s.late}/{s.total} classes</div>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                </div>
                <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                  {[{ label: 'Present', val: s.present, color: 'var(--neon-emerald)' }, { label: 'Late', val: s.late, color: 'var(--neon-amber)' }, { label: 'Absent', val: s.absent, color: 'var(--neon-rose)' }].map(item => (
                    <div key={item.label} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: item.color, fontFamily: 'var(--font-display)' }}>{item.val}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.label}</div>
                    </div>
                  ))}
                  {pct < 75 && <div style={{ marginLeft: 'auto', padding: '6px 12px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 'var(--radius-sm)', fontSize: '11px', color: 'var(--neon-rose)', alignSelf: 'center' }}>Low Attendance!</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
