import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ThemeSwitcher from '../components/ThemeSwitcher';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'faculty') navigate('/faculty');
      else navigate('/student');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const creds = {
      admin: { email: 'admin@college.edu', password: 'admin123' },
      faculty: { email: 'faculty@college.edu', password: 'faculty123' },
      student: { email: 'student@college.edu', password: 'student123' },
    };
    setForm(creds[role]);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
      {/* theme picker for unauthenticated screens */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100 }}><ThemeSwitcher /></div>
      <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '420px', animation: 'fadeIn 0.5s ease' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'inline-block', width: '100px', height: '100px', borderRadius: '22px', background: 'white', padding: '10px', boxShadow: '0 0 40px rgba(0,229,255,0.2), 0 8px 40px rgba(0,0,0,0.6)', marginBottom: '16px' }}>
            <img src="/logo.jpeg" alt="EduNexus" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: '900', background: 'linear-gradient(135deg, #00e5ff 0%, #2563eb 40%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px' }}>EduNexus</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>College Management System</p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '36px', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '4px' }}>Sign In</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="you@college.edu" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
            </div>
            <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}>
              {loading ? <><span className="spinner" style={{ width: '16px', height: '16px' }} /> Signing in...</> : 'Sign In →'}
            </button>
          </form>

          <div className="divider" />

          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick Demo Access</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {['admin', 'faculty', 'student'].map(role => (
                <button key={role} className="btn btn-ghost btn-sm" onClick={() => fillDemo(role)} style={{ justifyContent: 'center', textTransform: 'capitalize' }}>{role}</button>
              ))}
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
            New here? <Link to="/register" style={{ color: 'var(--neon-cyan)', textDecoration: 'none', fontWeight: '500' }}>Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
