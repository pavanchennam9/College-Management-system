import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_COLORS = { Monday: '#00e5ff', Tuesday: '#7c3aed', Wednesday: '#10b981', Thursday: '#f59e0b', Friday: '#f43f5e', Saturday: '#6366f1' };

function AddEntryModal({ onClose, onSave }) {
  const [form, setForm] = useState({ course: '', faculty: '', department: '', semester: '', dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00', room: '', type: 'lecture' });
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/courses'), api.get('/faculty')]).then(([cr, fr]) => {
      setCourses(cr.data.courses);
      setFaculty(fr.data.faculty);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await api.post('/timetable', form); toast.success('Entry added!'); onSave(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px' }}>Add Timetable Entry</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group"><label className="form-label">Course</label><select className="form-input" value={form.course} onChange={e => set('course', e.target.value)} required><option value="">Select...</option>{courses.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}</select></div>
          <div className="form-group"><label className="form-label">Faculty</label><select className="form-input" value={form.faculty} onChange={e => set('faculty', e.target.value)} required><option value="">Select...</option>{faculty.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}</select></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group"><label className="form-label">Department</label><input className="form-input" value={form.department} onChange={e => set('department', e.target.value)} required /></div>
            <div className="form-group"><label className="form-label">Semester</label><select className="form-input" value={form.semester} onChange={e => set('semester', e.target.value)} required><option value="">Select...</option>{[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}</select></div>
          </div>
          <div className="form-group"><label className="form-label">Day</label><select className="form-input" value={form.dayOfWeek} onChange={e => set('dayOfWeek', e.target.value)}>{DAYS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group"><label className="form-label">Start Time</label><input className="form-input" type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">End Time</label><input className="form-input" type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Room</label><input className="form-input" value={form.room} onChange={e => set('room', e.target.value)} required /></div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Adding...' : 'Add Entry'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TimetablePage() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [filters, setFilters] = useState({ department: user?.department || '', semester: user?.semester || '' });

  const fetch = async () => {
    setLoading(true);
    const params = {};
    if (filters.department) params.department = filters.department;
    if (filters.semester) params.semester = filters.semester;
    const r = await api.get('/timetable', { params });
    setTimetable(r.data.timetable);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [filters]);

  const grouped = DAYS.reduce((acc, day) => {
    acc[day] = timetable.filter(t => t.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {});

  const handleDelete = async (id) => {
    await api.delete(`/timetable/${id}`);
    toast.success('Entry removed');
    fetch();
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}><h1>Timetable</h1><p>Weekly class schedule</p></div>
        {user?.role === 'admin' && <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> Add Entry</button>}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input className="form-input" placeholder="Department..." value={filters.department} onChange={e => setFilters(p => ({ ...p, department: e.target.value }))} style={{ maxWidth: '200px' }} />
        <select className="form-input" value={filters.semester} onChange={e => setFilters(p => ({ ...p, semester: e.target.value }))} style={{ maxWidth: '150px' }}>
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
        </select>
      </div>

      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" style={{ width: '32px', height: '32px' }} /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {DAYS.map(day => {
            const entries = grouped[day];
            if (entries.length === 0) return null;
            return (
              <div key={day}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '3px', height: '20px', borderRadius: '2px', background: DAY_COLORS[day] }} />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: DAY_COLORS[day], textTransform: 'uppercase', letterSpacing: '0.08em' }}>{day}</h3>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{entries.length} classes</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                  {entries.map(e => (
                    <div key={e._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderLeft: `3px solid ${DAY_COLORS[day]}`, borderRadius: 'var(--radius-md)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div>
                        <p style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '13px', marginBottom: '4px' }}>{e.course?.name}</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{e.faculty?.name} • Room {e.room}</p>
                        <p style={{ fontSize: '12px', color: DAY_COLORS[day], marginTop: '6px', fontWeight: '500' }}>{e.startTime} – {e.endTime}</p>
                      </div>
                      {user?.role === 'admin' && (
                        <button onClick={() => handleDelete(e._id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}><X size={14} /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {timetable.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No timetable entries found</p>}
        </div>
      )}
      {modal && <AddEntryModal onClose={() => setModal(false)} onSave={() => { setModal(false); fetch(); }} />}
    </div>
  );
}
