import { useState, useEffect } from 'react';
import { Plus, X, Bell, Megaphone, BookOpen, Calendar, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const CAT_ICON = { urgent: AlertCircle, academic: BookOpen, exam: Megaphone, event: Calendar, general: Bell };
const CAT_COLOR = { urgent: 'rose', academic: 'violet', exam: 'amber', event: 'green', general: 'cyan' };

function NoticeModal({ onClose, onSave }) {
  const [form, setForm] = useState({ title: '', content: '', category: 'general', targetAudience: 'all' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await api.post('/notices', form); toast.success('Notice posted!'); onSave(); }
    catch (err) { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px' }}>Post New Notice</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group"><label className="form-label">Category</label><select className="form-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>{['general','academic','exam','event','urgent'].map(c => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Audience</label><select className="form-input" value={form.targetAudience} onChange={e => setForm(p => ({ ...p, targetAudience: e.target.value }))}>{['all','students','faculty','admin'].map(a => <option key={a} value={a} style={{ textTransform: 'capitalize' }}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}</select></div>
          </div>
          <div className="form-group"><label className="form-label">Content</label><textarea className="form-input" rows={4} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required /></div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Posting...' : 'Post Notice'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NoticesPage() {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);

  const fetch = () => api.get('/notices').then(r => { setNotices(r.data.notices); setLoading(false); });
  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Remove this notice?')) return;
    await api.delete(`/notices/${id}`);
    toast.success('Notice removed');
    fetch();
  };

  const canPost = user?.role === 'admin' || user?.role === 'faculty';

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}><h1>Notices & Announcements</h1><p>{notices.length} active notices</p></div>
        {canPost && <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> Post Notice</button>}
      </div>

      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" style={{ width: '32px', height: '32px' }} /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {notices.length === 0 ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No notices available</p> : notices.map(n => {
            const Icon = CAT_ICON[n.category] || Bell;
            const color = CAT_COLOR[n.category] || 'cyan';
            return (
              <div key={n._id} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `rgba(0,229,255,0.08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color="var(--neon-cyan)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: 'var(--text-primary)' }}>{n.title}</h4>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className={`badge badge-${color}`}>{n.category}</span>
                      <span className="badge badge-cyan" style={{ fontSize: '10px' }}>{n.targetAudience}</span>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', marginBottom: '8px' }}>{n.content}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Posted by {n.postedBy?.name} • {new Date(n.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    {user?.role === 'admin' && <button className="btn btn-ghost btn-sm" style={{ color: 'var(--neon-rose)' }} onClick={() => handleDelete(n._id)}>Remove</button>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {modal && <NoticeModal onClose={() => setModal(false)} onSave={() => { setModal(false); fetch(); }} />}
    </div>
  );
}
