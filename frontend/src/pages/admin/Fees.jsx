import { useState, useEffect } from 'react';
import { Plus, X, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const STATUS_BADGE = { paid: 'badge-green', pending: 'badge-amber', overdue: 'badge-rose', partial: 'badge-violet' };

function AddFeeModal({ onClose, onSave }) {
  const [form, setForm] = useState({ student: '', feeType: 'tuition', amount: '', dueDate: '', semester: '' });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => { api.get('/students').then(r => setStudents(r.data.students)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await api.post('/fees', form); toast.success('Fee record added!'); onSave(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px' }}>Add Fee Record</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group"><label className="form-label">Student</label><select className="form-input" value={form.student} onChange={e => set('student', e.target.value)} required><option value="">Select Student...</option>{students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.rollNumber || s.email})</option>)}</select></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group"><label className="form-label">Fee Type</label><select className="form-input" value={form.feeType} onChange={e => set('feeType', e.target.value)}>{['tuition', 'hostel', 'library', 'lab', 'exam', 'other'].map(t => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Amount (₹)</label><input className="form-input" type="number" value={form.amount} onChange={e => set('amount', e.target.value)} required min={1} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group"><label className="form-label">Due Date</label><input className="form-input" type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} required /></div>
            <div className="form-group"><label className="form-label">Semester</label><select className="form-input" value={form.semester} onChange={e => set('semester', e.target.value)}><option value="">N/A</option>{[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Sem {s}</option>)}</select></div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Adding...' : 'Add Record'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PayModal({ fee, onClose, onSave }) {
  const [form, setForm] = useState({ paidAmount: fee.amount - fee.paidAmount, paymentMode: 'online', transactionId: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await api.put(`/fees/${fee._id}/pay`, form); toast.success('Payment recorded!'); onSave(); }
    catch (err) { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px' }}>Record Payment</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Outstanding: <strong style={{ color: 'var(--neon-rose)' }}>₹{(fee.amount - fee.paidAmount).toLocaleString()}</strong></p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group"><label className="form-label">Amount (₹)</label><input className="form-input" type="number" value={form.paidAmount} onChange={e => setForm(p => ({ ...p, paidAmount: +e.target.value }))} max={fee.amount - fee.paidAmount} required /></div>
          <div className="form-group"><label className="form-label">Payment Mode</label><select className="form-input" value={form.paymentMode} onChange={e => setForm(p => ({ ...p, paymentMode: e.target.value }))}>{['cash', 'online', 'cheque', 'dd'].map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Transaction ID</label><input className="form-input" value={form.transactionId} onChange={e => setForm(p => ({ ...p, transactionId: e.target.value }))} placeholder="Optional" /></div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Processing...' : 'Confirm Payment'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function FeesPage() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [payModal, setPayModal] = useState(null);

  // derived summary values for the currently selected student
  const totalRecords = fees.length;
  const totalAmount = fees.reduce((a, f) => a + (f.amount || 0), 0);
  const totalPaid = fees.reduce((a, f) => a + (f.paidAmount || 0), 0);
  const totalPending = fees
    .filter(f => f.status !== 'paid')
    .reduce((acc, f) => acc + ((f.amount || 0) - (f.paidAmount || 0)), 0);

  const fetchFees = async () => {
    if (!selectedStudent) { setFees([]); return; }
    setLoading(true);
    const r = await api.get(`/fees/student/${selectedStudent}`);
    setFees(r.data.fees);
    setLoading(false);
  };

  useEffect(() => { api.get('/students').then(r => setStudents(r.data.students)); }, []);
  useEffect(() => { fetchFees(); }, [selectedStudent]);

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}><h1>Fee Management</h1><p>Track and record student fee payments</p></div>
        <button className="btn btn-primary" onClick={() => setAddModal(true)}><Plus size={16} /> Add Fee Record</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <select className="form-input" value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} style={{ maxWidth: '300px' }}>
          <option value="">Select Student...</option>
          {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.rollNumber || s.email})</option>)}
        </select>
      </div>

      {/* summary stats for the selected student; start at zero until fees load */}
      {selectedStudent && (
        <div className="grid-3" style={{ marginBottom: '28px' }}>
          <div className="stat-card rose">
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', marginBottom: '8px' }}>Pending Amount</p>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '800', color: 'var(--neon-rose)' }}>₹{totalPending.toLocaleString()}</div>
          </div>
          <div className="stat-card emerald">
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', marginBottom: '8px' }}>Total Paid</p>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '800', color: 'var(--neon-emerald)' }}>₹{totalPaid.toLocaleString()}</div>
          </div>
          <div className="stat-card cyan">
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', marginBottom: '8px' }}>Total Records</p>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '800', color: 'var(--neon-cyan)' }}>{totalRecords}</div>
          </div>
        </div>
      )}

      {!selectedStudent ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Select a student to view their fee records</div>
      ) : loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" style={{ width: '32px', height: '32px' }} /></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Fee Type</th><th>Amount</th><th>Paid</th><th>Due Date</th><th>Status</th><th>Mode</th><th>Actions</th></tr></thead>
            <tbody>
              {fees.length === 0 ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No fee records</td></tr> : fees.map(f => (
                <tr key={f._id}>
                  <td style={{ textTransform: 'capitalize', color: 'var(--text-primary)', fontWeight: '500' }}>{f.feeType}</td>
                  <td>₹{f.amount.toLocaleString()}</td>
                  <td style={{ color: 'var(--neon-emerald)' }}>₹{f.paidAmount.toLocaleString()}</td>
                  <td style={{ fontSize: '12px' }}>{new Date(f.dueDate).toLocaleDateString()}</td>
                  <td><span className={`badge ${STATUS_BADGE[f.status]}`}>{f.status}</span></td>
                  <td style={{ textTransform: 'uppercase', fontSize: '12px' }}>{f.paymentMode || '—'}</td>
                  <td>{f.status !== 'paid' && <button className="btn btn-primary btn-sm" onClick={() => setPayModal(f)}><CheckCircle size={13} /> Pay</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {addModal && <AddFeeModal onClose={() => setAddModal(false)} onSave={() => { setAddModal(false); fetchFees(); }} />}
      {payModal && <PayModal fee={payModal} onClose={() => setPayModal(null)} onSave={() => { setPayModal(null); fetchFees(); }} />}
    </div>
  );
}
