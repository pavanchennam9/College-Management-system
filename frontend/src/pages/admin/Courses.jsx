import { useState, useEffect } from 'react';
import { Plus, BookOpen, Users, X } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const DEPTS = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Business', 'Mathematics', 'Physics', 'Chemistry'];

function CourseModal({ course, onClose, onSave }) {
  const init = course ? { ...course, students: course.students ? course.students.map(s => s._id || s) : [] } : { name: '', code: '', department: '', semester: '', credits: 3, description: '', maxStudents: 60, faculty: '', students: [] };
  const [form, setForm] = useState(init);
  const [facultyList, setFacultyList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const isNew = !course;
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => { api.get('/faculty').then(r => setFacultyList(r.data.faculty)); }, []);
  useEffect(() => {
    api.get('/students').then(r => setStudentList(r.data.students));
  }, []);

  const handleSubmit = async (e) => {
    // if called from button click there is no event or preventDefault needed
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      // convert students array to just ids (it might already be ids)
      if (Array.isArray(payload.students)) payload.students = payload.students.map(s => s._id || s);
      if (isNew) { await api.post('/courses', payload); toast.success('Course created!'); }
      else { await api.put(`/courses/${course._id}`, payload); toast.success('Course updated!'); }
      onSave();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      {/* prevent clicks inside the modal from bubbling to the overlay and closing it */}
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px' }}>{isNew ? 'Add Course' : 'Edit Course'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        {/* use a div instead of native form to avoid accidental navigation when interacting with checkboxes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div className="form-group"><label className="form-label">Course Name</label><input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required /></div>
            <div className="form-group"><label className="form-label">Code</label><input className="form-input" value={form.code} onChange={e => set('code', e.target.value)} required /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group"><label className="form-label">Department</label><select className="form-input" value={form.department} onChange={e => set('department', e.target.value)} required><option value="">Select...</option>{DEPTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Semester</label><select className="form-input" value={form.semester} onChange={e => set('semester', e.target.value)} required><option value="">Select...</option>{[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Sem {s}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Credits</label><input className="form-input" type="number" min={1} max={6} value={form.credits} onChange={e => set('credits', e.target.value)} /></div>
          </div>
          <div className="form-group"><label className="form-label">Assign Faculty</label><select className="form-input" value={form.faculty} onChange={e => set('faculty', e.target.value)}><option value="">Unassigned</option>{facultyList.map(f => <option key={f._id} value={f._id}>{f.name} ({f.department || 'No Dept'})</option>)}</select></div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" value={form.description} onChange={e => set('description', e.target.value)} rows={2} /></div>
          <div className="form-group">
            <label className="form-label">Enroll Students</label>
            {/* helper text to guide the admin */}
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Tick the box to select students for this course. Changes take effect when you save.
              {!form.faculty && ' (assign a faculty first, enrollment disabled)'}
            </p>
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '6px' }}>
              {studentList.map(s => (
                <label key={s._id} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}
                  onClick={e => e.stopPropagation()}>
                  <input type="checkbox" value={s._id}
                    checked={form.students.includes(s._id)}
                    disabled={!form.faculty}
                    onClick={e => { e.stopPropagation(); e.preventDefault(); }}
                    onChange={async e => {
                      const id = e.target.value;
                      const checked = e.target.checked;

                      // update local state immediately so UI reflects change
                      set('students', prev => checked ? [...prev, id] : prev.filter(x => x !== id));

                      // persist right away if editing an existing course
                      if (!isNew && course && course._id) {
                        try {
                          if (checked) {
                            await api.post(`/courses/${course._id}/enroll`, { studentIds: [id] });
                          } else {
                            await api.post(`/courses/${course._id}/unenroll`, { studentIds: [id] });
                          }
                        } catch (err) {
                          toast.error('Failed to update enrollment');
                        }
                      }

                      // give immediate feedback when a student is toggled
                      if (checked) {
                        toast.success(`${s.name} will be added to the course`);
                        if (!form.faculty) {
                          toast('Remember to assign a faculty before marking attendance', { icon: 'ℹ️' });
                        }
                      } else {
                        toast(`${s.name} will be removed from the course`);
                      }
                    }}
                  />
                  <span style={{ fontSize: '13px' }}>{s.name} ({s.rollNumber || s.email})</span>
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-primary" disabled={loading} onClick={handleSubmit}>{loading ? 'Saving...' : (isNew ? 'Create Course' : 'Save Changes')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deptFilter, setDeptFilter] = useState('');

  const fetch = async () => {
    setLoading(true);
    const params = deptFilter ? { department: deptFilter } : {};
    const r = await api.get('/courses', { params });
    setCourses(r.data.courses);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [deptFilter]);

  const DEPT_COLORS = { 'Computer Science': 'cyan', 'Electronics': 'violet', 'Mechanical': 'amber', 'Civil': 'green', 'Business': 'rose' };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Courses</h1>
          <p>{courses.length} active courses</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('add')}><Plus size={16} /> New Course</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <select className="form-input" value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={{ maxWidth: '220px' }}>
          <option value="">All Departments</option>
          {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" style={{ width: '32px', height: '32px' }} /></div> : (
        <div className="grid-3">
          {courses.length === 0 ? <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>No courses found</p> : courses.map(c => {
            const color = DEPT_COLORS[c.department] || 'cyan';
            return (
              <div key={c._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', cursor: 'pointer' }} onClick={() => setModal(c)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `rgba(0,229,255,0.08)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={20} color="var(--neon-cyan)" />
                  </div>
                  <span className={`badge badge-${color}`}>{c.code}</span>
                </div>
                <div>
                  <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>{c.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.department} • Sem {c.semester}</p>
                </div>
                <div className="divider" style={{ margin: '0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <Users size={13} />
                    {c.students?.length || 0} students
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {c.faculty?.name || 'Unassigned'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {modal && <CourseModal course={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={() => { setModal(null); fetch(); }} />}
    </div>
  );
}
