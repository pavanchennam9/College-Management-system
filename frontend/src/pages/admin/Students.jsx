import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const DEPTS = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Business', 'Mathematics', 'Physics', 'Chemistry'];

function StudentModal({ student, onClose, onSave }) {
  const [form, setForm] = useState(student || { name: '', email: '', password: '', role: 'student', department: '', semester: '', phone: '', rollNumber: '' });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const isNew = !student;

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (isNew) { await api.post('/auth/register', form); toast.success('Student added!'); }
      else { await api.put(`/students/${student._id}`, form); toast.success('Student updated!'); }
      onSave();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px' }}>{isNew ? 'Add New Student' : 'Edit Student'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required /></div>
            <div className="form-group"><label className="form-label">Roll Number</label><input className="form-input" value={form.rollNumber} onChange={e => set('rollNumber', e.target.value)} /></div>
          </div>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} required /></div>
          {isNew && <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} /></div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group"><label className="form-label">Department</label><select className="form-input" value={form.department} onChange={e => set('department', e.target.value)}><option value="">Select...</option>{DEPTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Semester</label><select className="form-input" value={form.semester} onChange={e => set('semester', e.target.value)}><option value="">Select...</option>{[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}</select></div>
          </div>
          <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : (isNew ? 'Add Student' : 'Save Changes')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | student

  const fetch = async () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (deptFilter) params.department = deptFilter;
    const r = await api.get('/students', { params });
    setStudents(r.data.students);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [search, deptFilter]);

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this student?')) return;
    await api.delete(`/students/${id}`);
    toast.success('Student deactivated');
    fetch();
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Students</h1>
          <p>{students.length} enrolled students</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('add')}><Plus size={16} /> Add Student</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div className="search-box" style={{ flex: 1, minWidth: '200px' }}>
          <Search className="search-icon" size={16} />
          <input className="form-input" placeholder="Search by name, email, roll..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '40px', width: '100%' }} />
        </div>
        <select className="form-input" value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={{ minWidth: '180px' }}>
          <option value="">All Departments</option>
          {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" style={{ width: '32px', height: '32px' }} /></div> : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Roll No.</th><th>Email</th><th>Department</th><th>Semester</th><th>Phone</th><th>Actions</th></tr></thead>
            <tbody>
              {students.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No students found</td></tr>
              ) : students.map((s, i) => (
                <tr key={s._id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{i + 1}</td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,229,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--neon-cyan)', fontWeight: '700', fontFamily: 'var(--font-display)', fontSize: '13px', flexShrink: 0 }}>{s.name.charAt(0)}</div><span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{s.name}</span></div></td>
                  <td><span className="badge badge-cyan">{s.rollNumber || '—'}</span></td>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{s.email}</td>
                  <td>{s.department || '—'}</td>
                  <td>{s.semester ? `Sem ${s.semester}` : '—'}</td>
                  <td>{s.phone || '—'}</td>
                  <td><div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setModal(s)}><Edit size={13} /></button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--neon-rose)' }} onClick={() => handleDelete(s._id)}><Trash2 size={13} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && <StudentModal student={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={() => { setModal(null); fetch(); }} />}
    </div>
  );
}
