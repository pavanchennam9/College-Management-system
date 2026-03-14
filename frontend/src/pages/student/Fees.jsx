import { useState, useEffect } from 'react';
import api from '../../utils/api';

const STATUS_BADGE = { paid: 'badge-green', pending: 'badge-amber', overdue: 'badge-rose', partial: 'badge-violet' };

export default function StudentFees() {
  const [fees, setFees] = useState([]);
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/fees/my').then(r => { setFees(r.data.fees); setPending(r.data.totalPending); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" style={{ width: '32px', height: '32px' }} /></div>;

  const paid = fees.filter(f => f.status === 'paid').reduce((a, f) => a + f.paidAmount, 0);

  return (
    <div className="animate-fade">
      <div className="page-header"><h1>Fee Details</h1><p>Your fee payment records</p></div>

      <div className="grid-3" style={{ marginBottom: '28px' }}>
        <div className="stat-card rose">
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', marginBottom: '8px' }}>Pending Amount</p>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '800', color: 'var(--neon-rose)' }}>₹{pending.toLocaleString()}</div>
        </div>
        <div className="stat-card emerald">
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', marginBottom: '8px' }}>Total Paid</p>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '800', color: 'var(--neon-emerald)' }}>₹{paid.toLocaleString()}</div>
        </div>
        <div className="stat-card cyan">
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', marginBottom: '8px' }}>Total Records</p>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '800', color: 'var(--neon-cyan)' }}>{fees.length}</div>
        </div>
      </div>

      {fees.length === 0 ? <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>No fee records</div> : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Fee Type</th><th>Amount</th><th>Paid</th><th>Due Date</th><th>Paid Date</th><th>Status</th><th>Mode</th></tr></thead>
            <tbody>
              {fees.map(f => (
                <tr key={f._id}>
                  <td style={{ textTransform: 'capitalize', color: 'var(--text-primary)', fontWeight: '500' }}>{f.feeType}</td>
                  <td>₹{f.amount.toLocaleString()}</td>
                  <td style={{ color: 'var(--neon-emerald)' }}>₹{f.paidAmount.toLocaleString()}</td>
                  <td style={{ fontSize: '12px' }}>{new Date(f.dueDate).toLocaleDateString()}</td>
                  <td style={{ fontSize: '12px' }}>{f.paidDate ? new Date(f.paidDate).toLocaleDateString() : '—'}</td>
                  <td><span className={`badge ${STATUS_BADGE[f.status]}`}>{f.status}</span></td>
                  <td style={{ textTransform: 'uppercase', fontSize: '12px' }}>{f.paymentMode || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
