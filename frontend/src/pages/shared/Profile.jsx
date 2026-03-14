import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { User, Lock, Mail, Phone, Building, BookOpen } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '', department: user?.department || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const r = await api.put('/auth/update-profile', profileForm);
      updateUser(r.data.user);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('Password must be at least 6 chars'); return; }
    setPwLoading(true);
    try {
      await api.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setPwLoading(false); }
  };

  const ROLE_COLOR = { admin: '#f43f5e', faculty: '#7c3aed', student: '#00e5ff' };

  return (
    <div className="animate-fade">
      <div className="page-header"><h1>My Profile</h1><p>Manage your account information</p></div>

      {/* Avatar Card */}
      <div className="card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: `rgba(${user?.role === 'admin' ? '244,63,94' : user?.role === 'faculty' ? '124,58,237' : '0,229,255'},0.1)`, border: `2px solid ${ROLE_COLOR[user?.role]}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: '900', fontSize: '32px', color: ROLE_COLOR[user?.role], flexShrink: 0 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '6px' }}>{user?.name}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>{user?.email}</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ padding: '4px 12px', borderRadius: '100px', background: `rgba(${user?.role === 'admin' ? '244,63,94' : user?.role === 'faculty' ? '124,58,237' : '0,229,255'},0.1)`, border: `1px solid ${ROLE_COLOR[user?.role]}30`, color: ROLE_COLOR[user?.role], fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' }}>{user?.role}</span>
            {user?.rollNumber && <span className="badge badge-cyan">{user.rollNumber}</span>}
            {user?.employeeId && <span className="badge badge-violet">{user.employeeId}</span>}
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Edit Profile */}
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} color="var(--neon-cyan)" /> Edit Profile</h3>
          <form onSubmit={handleProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" value={user?.email} disabled style={{ opacity: 0.5 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input className="form-input" value={profileForm.department} onChange={e => setProfileForm(p => ({ ...p, department: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>

        {/* Change Password */}
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Lock size={16} color="var(--neon-violet)" /> Change Password</h3>
          <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input className="form-input" type="password" value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input className="form-input" type="password" value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} required minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input className="form-input" type="password" value={pwForm.confirmPassword} onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))} required />
            </div>
            <button type="submit" className="btn btn-secondary" disabled={pwLoading}>{pwLoading ? 'Updating...' : 'Change Password'}</button>
          </form>
        </div>
      </div>

      {/* Account Info */}
      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '16px' }}>Account Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Role', value: user?.role, icon: User },
            { label: 'Email', value: user?.email, icon: Mail },
            { label: 'Department', value: user?.department || 'Not set', icon: Building },
            { label: 'Semester', value: user?.semester ? `Semester ${user.semester}` : 'N/A', icon: BookOpen },
            { label: 'Phone', value: user?.phone || 'Not set', icon: Phone },
          ].map(info => (
            <div key={info.label} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <info.icon size={14} color="var(--text-muted)" style={{ marginTop: '3px', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>{info.label}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500', textTransform: info.label === 'Role' ? 'capitalize' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{info.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
