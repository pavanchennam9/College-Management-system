import { useState, useEffect } from 'react';
import api from '../../utils/api';

// B.Tech credit-based grading system (10-point scale like JNTUH/VTU/Anna)
const GRADE_MAP = { 'O': { points: 10, label: '≥90' }, 'A+': { points: 9, label: '≥80' }, 'A': { points: 8, label: '≥70' }, 'B+': { points: 7, label: '≥60' }, 'B': { points: 6, label: '≥50' }, 'C': { points: 5, label: '≥45' }, 'F': { points: 0, label: '<45' } };
const GRADE_COLOR = { 'O': '#00e5ff', 'A+': '#10b981', 'A': '#22d3ee', 'B+': '#a78bfa', 'B': '#3b82f6', 'C': '#f59e0b', 'F': '#f43f5e' };

function calcGrade(marks, total) {
  const pct = (marks / total) * 100;
  if (pct >= 90) return 'O';
  if (pct >= 80) return 'A+';
  if (pct >= 70) return 'A';
  if (pct >= 60) return 'B+';
  if (pct >= 50) return 'B';
  if (pct >= 45) return 'C';
  return 'F';
}

function calcSGPA(semGrades) {
  // SGPA = Σ(Grade Points × Credits) / Σ(Credits)
  const totalCredits = semGrades.reduce((s, g) => s + (g.course?.credits || 3), 0);
  if (!totalCredits) return 0;
  const totalPoints = semGrades.reduce((s, g) => {
    const grade = calcGrade(g.marksObtained, g.totalMarks);
    return s + (GRADE_MAP[grade]?.points || 0) * (g.course?.credits || 3);
  }, 0);
  return (totalPoints / totalCredits).toFixed(2);
}

function calcCGPA(allGrades) {
  // CGPA = Σ(Grade Points × Credits across ALL semesters) / Σ(All Credits)
  const totalCredits = allGrades.reduce((s, g) => s + (g.course?.credits || 3), 0);
  if (!totalCredits) return '0.00';
  const totalPoints = allGrades.reduce((s, g) => {
    const grade = calcGrade(g.marksObtained, g.totalMarks);
    return s + (GRADE_MAP[grade]?.points || 0) * (g.course?.credits || 3);
  }, 0);
  return (totalPoints / totalCredits).toFixed(2);
}

function CGPAMeter({ cgpa }) {
  const pct = (cgpa / 10) * 100;
  const color = cgpa >= 8.5 ? '#00e5ff' : cgpa >= 7.5 ? '#10b981' : cgpa >= 6.5 ? '#a78bfa' : cgpa >= 5 ? '#f59e0b' : '#f43f5e';
  return (
    <div style={{ position: 'relative', width: '160px', height: '160px' }}>
      <svg viewBox="0 0 160 160" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
        <circle cx="80" cy="80" r="68" fill="none" stroke="var(--bg-surface)" strokeWidth="12" />
        <circle cx="80" cy="80" r="68" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 68}`}
          strokeDashoffset={`${2 * Math.PI * 68 * (1 - pct / 100)}`}
          style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease', filter: `drop-shadow(0 0 8px ${color}80)` }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: '900', color, lineHeight: 1 }}>{cgpa}</span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>CGPA</span>
      </div>
    </div>
  );
}

export default function StudentGrades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/grades/my').then(r => setGrades(r.data.grades)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" style={{ width: '32px', height: '32px' }} /></div>;

  const cgpa = calcCGPA(grades);
  const totalCredits = grades.reduce((s, g) => s + (g.course?.credits || 3), 0);
  const earnedCredits = grades.filter(g => calcGrade(g.marksObtained, g.totalMarks) !== 'F').reduce((s, g) => s + (g.course?.credits || 3), 0);

  const grouped = grades.reduce((acc, g) => {
    const sem = g.semester || 'Other';
    if (!acc[sem]) acc[sem] = [];
    acc[sem].push(g);
    return acc;
  }, {});

  return (
    <div className="animate-fade">
      <div className="page-header">
        <h1>Academic Performance</h1>
        <p>Credit-weighted CGPA as per B.Tech grading system (10-point scale)</p>
      </div>

      {/* CGPA Overview */}
      <div className="card" style={{ marginBottom: '28px', background: 'linear-gradient(135deg, rgba(0,229,255,0.04) 0%, rgba(124,58,237,0.06) 100%)', borderColor: 'rgba(0,229,255,0.15)' }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
          <CGPAMeter cgpa={parseFloat(cgpa)} />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '4px' }}>Cumulative GPA: {cgpa} / 10.0</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>B.Tech Credit-Weighted Grading — JNTUH/VTU Compatible</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { label: 'Total Credits', value: totalCredits, color: 'var(--neon-cyan)' },
                { label: 'Credits Earned', value: earnedCredits, color: 'var(--neon-emerald)' },
                { label: 'Subjects', value: grades.length, color: '#a78bfa' },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--bg-surface)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '800', color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Grade scale legend */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.entries(GRADE_MAP).map(([g, info]) => (
                <div key={g} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: GRADE_COLOR[g] }}>{g}</span>
                  <span>({info.label}% → {info.points}pts)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Per-semester breakdown */}
      {grades.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>No grades recorded yet</div>
      ) : (
        Object.entries(grouped).sort(([a], [b]) => +b - +a).map(([sem, semGrades]) => {
          const sgpa = calcSGPA(semGrades);
          const semCredits = semGrades.reduce((s, g) => s + (g.course?.credits || 3), 0);
          const sgpaColor = sgpa >= 8.5 ? '#00e5ff' : sgpa >= 7 ? '#10b981' : sgpa >= 6 ? '#a78bfa' : sgpa >= 5 ? '#f59e0b' : '#f43f5e';
          return (
            <div key={sem} style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '3px', height: '20px', borderRadius: '2px', background: 'var(--neon-cyan)' }} />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{sem === 'Other' ? 'Other' : `Semester ${sem}`}</h3>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{semCredits} credits</span>
                  <div style={{ padding: '4px 14px', borderRadius: '100px', background: `${sgpaColor}15`, border: `1px solid ${sgpaColor}30` }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '14px', color: sgpaColor }}>SGPA: {sgpa}</span>
                  </div>
                </div>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Subject</th><th>Code</th><th>Credits</th><th>Exam</th><th>Marks</th><th>%</th><th>Grade</th><th>Points</th><th>Grade×Credits</th></tr></thead>
                  <tbody>
                    {semGrades.map(g => {
                      const grade = calcGrade(g.marksObtained, g.totalMarks);
                      const pct = ((g.marksObtained / g.totalMarks) * 100).toFixed(1);
                      const credits = g.course?.credits || 3;
                      const gradePoints = GRADE_MAP[grade]?.points || 0;
                      return (
                        <tr key={g._id}>
                          <td style={{ color: 'var(--text-primary)', fontWeight: '500', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.course?.name}</td>
                          <td><span className="badge badge-cyan" style={{ fontSize: '10px' }}>{g.course?.code}</span></td>
                          <td style={{ textAlign: 'center', fontWeight: '700', color: 'var(--neon-cyan)' }}>{credits}</td>
                          <td style={{ textTransform: 'capitalize', fontSize: '11px' }}>{g.examType}</td>
                          <td>{g.marksObtained}/{g.totalMarks}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div className="progress-bar" style={{ width: '50px' }}>
                                <div className="progress-fill" style={{ width: `${pct}%`, background: GRADE_COLOR[grade] }} />
                              </div>
                              <span style={{ fontSize: '11px' }}>{pct}%</span>
                            </div>
                          </td>
                          <td><span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: '900', color: GRADE_COLOR[grade] }}>{grade}</span></td>
                          <td style={{ color: 'var(--neon-cyan)', fontWeight: '700', textAlign: 'center' }}>{gradePoints}</td>
                          <td style={{ fontWeight: '700', color: 'var(--text-primary)', textAlign: 'center' }}>{gradePoints * credits}</td>
                        </tr>
                      );
                    })}
                    <tr style={{ background: 'rgba(0,229,255,0.04)', fontWeight: '700' }}>
                      <td colSpan={2} style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-display)' }}>SEMESTER TOTAL</td>
                      <td style={{ color: 'var(--neon-cyan)', textAlign: 'center' }}>{semCredits}</td>
                      <td colSpan={5}></td>
                      <td style={{ color: sgpaColor, fontFamily: 'var(--font-display)', fontSize: '14px', textAlign: 'center' }}>SGPA: {sgpa}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}

      {/* CGPA Formula explainer */}
      <div className="card" style={{ marginTop: '8px', background: 'rgba(0,229,255,0.03)', borderColor: 'rgba(0,229,255,0.1)' }}>
        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>How CGPA is Calculated (B.Tech Credit System)</h4>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.8' }}>
          <strong style={{ color: 'var(--neon-cyan)' }}>SGPA</strong> = Σ(Grade Points × Subject Credits) ÷ Σ(Credits in that semester)<br />
          <strong style={{ color: '#a78bfa' }}>CGPA</strong> = Σ(Grade Points × Credits across ALL semesters) ÷ Σ(Total Credits earned)<br />
          Grade Scale: O(10) A+(9) A(8) B+(7) B(6) C(5) F(0) — 10-point scale compatible with JNTUH, VTU, Anna University
        </p>
      </div>
    </div>
  );
}
