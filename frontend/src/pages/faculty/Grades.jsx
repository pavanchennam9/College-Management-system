import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const GRADE_COLOR = { 'A+': '#00e5ff', 'A': '#10b981', 'B+': '#a78bfa', 'B': '#3b82f6', 'C': '#f59e0b', 'F': '#f43f5e' };

function AddGradeModal({ onClose, onSave }) {
  const [form, setForm] = useState({ student: '', course: '', semester: '', examType: 'internal', marksObtained: '', totalMarks: 100, remarks: '' });
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/courses'), api.get('/students')]).then(([cr, sr]) => {
      setCourses(cr.data.courses);
      setStudents(sr.data.students);
    });
  }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await api.post('/grades', form); toast.success('Grade added!'); onSave(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px' }}>Add Grade</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group"><label className="form-label">Student</label><select className="form-input" value={form.student} onChange={e => set('student', e.target.value)} required><option value="">Select...</option>{students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.rollNumber || s.email})</option>)}</select></div>
          <div className="form-group"><label className="form-label">Course</label><select className="form-input" value={form.course} onChange={e => set('course', e.target.value)} required><option value="">Select...</option>{courses.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}</select></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group"><label className="form-label">Exam Type</label><select className="form-input" value={form.examType} onChange={e => set('examType', e.target.value)}>{['internal','midterm','final','assignment'].map(t => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Semester</label><select className="form-input" value={form.semester} onChange={e => set('semester', e.target.value)} required><option value="">Select...</option>{[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}</select></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group"><label className="form-label">Marks Obtained</label><input className="form-input" type="number" min={0} value={form.marksObtained} onChange={e => set('marksObtained', e.target.value)} required /></div>
            <div className="form-group"><label className="form-label">Total Marks</label><input className="form-input" type="number" min={1} value={form.totalMarks} onChange={e => set('totalMarks', e.target.value)} required /></div>
          </div>
          <div className="form-group"><label className="form-label">Remarks</label><input className="form-input" value={form.remarks} onChange={e => set('remarks', e.target.value)} placeholder="Optional" /></div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Add Grade'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GradesPage() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => { api.get('/courses').then(r => setCourses(r.data.courses)); }, []);

  const fetchGrades = () => {
    if (!selectedCourse) return;
    setLoading(true);
    api.get(`/grades/course/${selectedCourse}`).then(r => setGrades(r.data.grades)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchGrades(); }, [selectedCourse]);

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}><h1>Manage Grades</h1><p>Enter and manage student grades</p></div>
        <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> Add Grade</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <select className="form-input" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} style={{ maxWidth: '300px' }}>
          <option value="">Filter by Course...</option>
          {courses.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
        </select>
      </div>

      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" style={{ width: '32px', height: '32px' }} /></div> : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Student</th><th>Roll No.</th><th>Course</th><th>Exam</th><th>Marks</th><th>%</th><th>Grade</th><th>GPA</th></tr></thead>
            <tbody>
              {grades.length === 0 ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>{selectedCourse ? 'No grades found' : 'Select a course'}</td></tr> : grades.map(g => {
                const pct = ((g.marksObtained / g.totalMarks) * 100).toFixed(1);
                return (
                  <tr key={g._id}>
                    <td style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{g.student?.name}</td>
                    <td><span className="badge badge-cyan">{g.student?.rollNumber || '—'}</span></td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{g.course?.code}</td>
                    <td style={{ textTransform: 'capitalize' }}>{g.examType}</td>
                    <td>{g.marksObtained}/{g.totalMarks}</td>
                    <td>{pct}%</td>
                    <td><span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: '800', color: GRADE_COLOR[g.grade] || 'var(--text-primary)' }}>{g.grade}</span></td>
                    <td style={{ color: 'var(--neon-cyan)', fontWeight: '600' }}>{g.gpa?.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {modal && <AddGradeModal onClose={() => setModal(false)} onSave={() => { setModal(false); fetchGrades(); }} />}
    </div>
  );
}
