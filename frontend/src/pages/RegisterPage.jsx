import { useState } from "react"; // useState still used for loading flag
import { Link, useNavigate } from 'react-router-dom';
import usePersistentState from '../utils/usePersistentState';
import api from '../utils/api';
import toast from 'react-hot-toast';
import ThemeSwitcher from '../components/ThemeSwitcher';

const DEPARTMENTS = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Business', 'Mathematics', 'Physics', 'Chemistry'];

export default function RegisterPage() {
  // keep the register form values across sessions in case the user leaves
  const [form, setForm] = usePersistentState('register-form', {
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    semester: '',
    phone: '',
    rollNumber: '',
    employeeId: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (form.role === 'student') delete payload.employeeId;
      else delete payload.rollNumber;
      await api.post('/auth/register', payload);
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100 }}><ThemeSwitcher /></div>
      <div style={{ width: '100%', maxWidth: '520px', animation: 'fadeIn 0.5s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #00e5ff, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '900', color: '#020408', fontFamily: 'var(--font-display)' }}>E</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '800', background: 'linear-gradient(135deg, #00e5ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EduNexus</span>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '36px', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '6px' }}>Create an account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '28px' }}>Join the EduNexus platform</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-input" value={form.role} onChange={e => set('role', e.target.value)}>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@college.edu" value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="form-input" value={form.department} onChange={e => set('department', e.target.value)}>
                  <option value="">Select...</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
            </div>
            {form.role === 'student' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Roll Number</label>
                  <input className="form-input" placeholder="2024CS001" value={form.rollNumber} onChange={e => set('rollNumber', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <select className="form-input" value={form.semester} onChange={e => set('semester', e.target.value)}>
                    <option value="">Select...</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              </div>
            )}
            {form.role === 'faculty' && (
              <div className="form-group">
                <label className="form-label">Employee ID</label>
                <input className="form-input" placeholder="FAC001" value={form.employeeId} onChange={e => set('employeeId', e.target.value)} />
              </div>
            )}
            <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}>
              {loading ? <><span className="spinner" style={{ width: '16px', height: '16px' }} /> Creating...</> : 'Create Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--neon-cyan)', textDecoration: 'none', fontWeight: '500' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
