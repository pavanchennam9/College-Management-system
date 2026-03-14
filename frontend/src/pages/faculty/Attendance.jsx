import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const STATUS_OPTS = [
  { v: 'present', label: 'Present', icon: CheckCircle, color: 'var(--neon-emerald)' },
  { v: 'absent', label: 'Absent', icon: XCircle, color: 'var(--neon-rose)' },
  { v: 'late', label: 'Late', icon: Clock, color: 'var(--neon-amber)' },
];

export default function AttendancePage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    // only fetch when user info available
    if (!user) return;
    const params = {};
    // fetch all courses for faculty as well; endpoint will respect ``all``
    if (user.role === 'faculty') params.all = true;
    api.get('/courses', { params }).then(r => setCourses(r.data.courses));
  }, [user]);

  const loadCourse = () => {
    if (!selectedCourse) return;
    setLoading(true);
    api.get(`/courses/${selectedCourse}`).then(r => {
      const studs = r.data.course.students || [];
      setStudents(studs);
      const init = {};
      studs.forEach(s => init[s._id] = 'present');
      setRecords(init);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCourse();
  }, [selectedCourse]);

  const handleSubmit = async () => {
    if (!selectedCourse) { toast.error('Select a course'); return; }
    setSubmitting(true);
    try {
      const recordsArr = Object.entries(records).map(([studentId, status]) => ({ studentId, status }));
      await api.post('/attendance', { courseId: selectedCourse, date, records: recordsArr });
      toast.success('Attendance marked successfully!');
    } catch (err) {
      toast.error('Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const setAll = (status) => {
    const updated = {};
    students.forEach(s => updated[s._id] = status);
    setRecords(updated);
  };

  return (
    <div className="animate-fade">
      <div className="page-header"><h1>Mark Attendance</h1><p>Record attendance for your classes</p></div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label">Course</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select className="form-input" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                <option value="">Select Course...</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
              </select>
              {selectedCourse && <button className="btn btn-ghost btn-sm" onClick={loadCourse} title="Reload students">🔄</button>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>
      </div>

      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><div className="spinner" style={{ width: '32px', height: '32px' }} /></div> : students.length > 0 ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{students.length} students enrolled</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', alignSelf: 'center' }}>Mark all:</span>
              {STATUS_OPTS.map(s => (
                <button key={s.v} className="btn btn-ghost btn-sm" onClick={() => setAll(s.v)} style={{ color: s.color, borderColor: s.color + '40' }}>{s.label}</button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            {students.map((student, i) => (
              <div key={student._id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderBottom: i < students.length - 1 ? '1px solid var(--border-subtle)' : 'none', flexWrap: 'wrap' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0,229,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--neon-cyan)', fontFamily: 'var(--font-display)', fontWeight: '700', flexShrink: 0 }}>
                  {student.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <p style={{ fontWeight: '500', color: 'var(--text-primary)', fontSize: '13px' }}>{student.name}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{student.rollNumber || student.email}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {STATUS_OPTS.map(opt => (
                    <button key={opt.v} onClick={() => setRecords(p => ({ ...p, [student._id]: opt.v }))}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: 'var(--radius-sm)', border: `1px solid ${records[student._id] === opt.v ? opt.color : 'var(--border-subtle)'}`, background: records[student._id] === opt.v ? `${opt.color}15` : 'transparent', color: records[student._id] === opt.v ? opt.color : 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', fontWeight: '500', transition: 'all 0.15s ease' }}>
                      <opt.icon size={13} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : `Submit Attendance (${students.length} students)`}
            </button>
          </div>
        </>
      ) : selectedCourse ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No students enrolled in this course</div>
      ) : null}
    </div>
  );
}
