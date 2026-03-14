import { useState, useEffect } from 'react';
import { Plus, Search, Edit, X } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const DEPTS = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Business', 'Mathematics', 'Physics', 'Chemistry'];

function FacultyModal({ faculty, onClose, onSave }) {
  const [form, setForm] = useState(faculty || { name: '', email: '', password: '', role: 'faculty', department: '', phone: '', employeeId: '' });
  const [loading, setLoading] = useState(false);
  const isNew = !faculty;
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (isNew) { await api.post('/auth/register', form); toast.success('Faculty added!'); }
      else { await api.put(`/faculty/${faculty._id}`, form); toast.success('Faculty updated!'); }
      onSave();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px' }}>{isNew ? 'Add Faculty' : 'Edit Faculty'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required /></div>
            <div className="form-group"><label className="form-label">Employee ID</label><input className="form-input" value={form.employeeId} onChange={e => set('employeeId', e.target.value)} /></div>
          </div>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} required /></div>
          {isNew && <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} /></div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group"><label className="form-label">Department</label><select className="form-input" value={form.department} onChange={e => set('department', e.target.value)}><option value="">Select...</option>{DEPTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : (isNew ? 'Add Faculty' : 'Save Changes')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function FacultyPage() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const fetch = async () => {
    setLoading(true);
    const params = search ? { search } : {};
    const r = await api.get('/faculty', { params });
    setFaculty(r.data.faculty);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [search]);

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Faculty</h1>
          <p>{faculty.length} faculty members</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('add')}><Plus size={16} /> Add Faculty</button>
      </div>
      <div className="search-box" style={{ marginBottom: '20px' }}>
        <Search className="search-icon" size={16} />
        <input className="form-input" placeholder="Search faculty..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '40px', width: '100%', maxWidth: '360px' }} />
      </div>
      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" style={{ width: '32px', height: '32px' }} /></div> : (
        <div className="grid-3" style={{ gap: '16px' }}>
          {faculty.length === 0 ? <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>No faculty found</p> : faculty.map(f => (
            <div key={f._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '18px', flexShrink: 0 }}>{f.name.charAt(0)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>{f.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.email}</p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setModal(f)}><Edit size={13} /></button>
              </div>
              <div className="divider" style={{ margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="badge badge-violet">{f.employeeId || 'No ID'}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{f.department || 'No Dept'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {modal && <FacultyModal faculty={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={() => { setModal(null); fetch(); }} />}
    </div>
  );
}
