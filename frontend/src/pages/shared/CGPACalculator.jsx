import { useState, useCallback } from 'react';
import { Plus, Trash2, RefreshCw, Download, Trophy, TrendingUp, BookOpen } from 'lucide-react';

const GRADE_POINTS = {
  'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0, 'Ab': 0
};
const GRADE_COLORS = {
  'O': '#00e5ff', 'A+': '#10b981', 'A': '#22d3ee', 'B+': '#a78bfa', 'B': '#3b82f6',
  'C': '#f59e0b', 'P': '#fb923c', 'F': '#f43f5e', 'Ab': '#ef4444'
};
const GRADE_OPTIONS = Object.keys(GRADE_POINTS);

function createSubject(id) {
  return { id, name: '', credits: 3, grade: 'A', gp: 8 };
}

function createSemester(id) {
  return { id, name: `Semester ${id}`, subjects: [createSubject(1), createSubject(2), createSubject(3)] };
}

let subjectCounter = 10;

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState([createSemester(1), createSemester(2)]);
  const [activeTab, setActiveTab] = useState('multi'); // 'multi' | 'single'

  // Single semester GPA
  const [singleSubjects, setSingleSubjects] = useState([createSubject(1), createSubject(2), createSubject(3)]);

  // ── MULTI SEMESTER ──
  const addSemester = () => {
    setSemesters(p => [...p, createSemester(p.length + 1)]);
  };

  const removeSemester = (semId) => {
    setSemesters(p => p.filter(s => s.id !== semId));
  };

  const addSubject = (semId) => {
    setSemesters(p => p.map(s => s.id === semId
      ? { ...s, subjects: [...s.subjects, createSubject(++subjectCounter)] }
      : s
    ));
  };

  const removeSubject = (semId, subId) => {
    setSemesters(p => p.map(s => s.id === semId
      ? { ...s, subjects: s.subjects.filter(sub => sub.id !== subId) }
      : s
    ));
  };

  const updateSubject = (semId, subId, field, value) => {
    setSemesters(p => p.map(s => s.id === semId
      ? {
          ...s, subjects: s.subjects.map(sub => {
            if (sub.id !== subId) return sub;
            const updated = { ...sub, [field]: value };
            if (field === 'grade') updated.gp = GRADE_POINTS[value] ?? 0;
            return updated;
          })
        }
      : s
    ));
  };

  const updateSemName = (semId, name) => {
    setSemesters(p => p.map(s => s.id === semId ? { ...s, name } : s));
  };

  const calcSemGPA = (subjects) => {
    const totalCredits = subjects.reduce((a, s) => a + Number(s.credits), 0);
    if (!totalCredits) return 0;
    const totalPoints = subjects.reduce((a, s) => a + Number(s.credits) * Number(s.gp), 0);
    return (totalPoints / totalCredits).toFixed(2);
  };

  const calcCGPA = () => {
    const allSubs = semesters.flatMap(s => s.subjects);
    return calcSemGPA(allSubs);
  };

  const cgpa = parseFloat(calcCGPA());
  const cgpaColor = cgpa >= 9 ? '#00e5ff' : cgpa >= 8 ? '#10b981' : cgpa >= 7 ? '#a78bfa' : cgpa >= 6 ? '#f59e0b' : '#f43f5e';
  const cgpaLabel = cgpa >= 9 ? 'Outstanding' : cgpa >= 8 ? 'Excellent' : cgpa >= 7 ? 'Very Good' : cgpa >= 6 ? 'Good' : cgpa >= 5 ? 'Average' : 'Below Average';

  // ── SINGLE SEMESTER ──
  const addSingle = () => setSingleSubjects(p => [...p, createSubject(++subjectCounter)]);
  const removeSingle = (id) => setSingleSubjects(p => p.filter(s => s.id !== id));
  const updateSingle = (id, field, value) => {
    setSingleSubjects(p => p.map(s => {
      if (s.id !== id) return s;
      const u = { ...s, [field]: value };
      if (field === 'grade') u.gp = GRADE_POINTS[value] ?? 0;
      return u;
    }));
  };
  const singleGPA = parseFloat(calcSemGPA(singleSubjects));

  const reset = () => {
    setSemesters([createSemester(1), createSemester(2)]);
    setSingleSubjects([createSubject(1), createSubject(2), createSubject(3)]);
  };

  return (
    <div className="animate-fade">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>🎓</span> CGPA Calculator
          </h1>
          <p>Calculate your GPA and CGPA with precision</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost btn-sm" onClick={reset}><RefreshCw size={14} /> Reset</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--bg-surface)', padding: '4px', borderRadius: '12px', width: 'fit-content', border: '1px solid var(--border-subtle)' }}>
        {[{ id: 'multi', label: '🏫 Multi-Semester CGPA' }, { id: 'single', label: '📚 Single Semester GPA' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 18px', borderRadius: '9px', border: 'none', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: activeTab === tab.id ? '600' : '400',
              background: activeTab === tab.id ? 'linear-gradient(135deg, var(--accent-1), var(--accent-2))' : 'transparent',
              color: activeTab === tab.id ? 'var(--bg-void)' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === tab.id ? '0 4px 12px var(--accent-glow)' : 'none',
            }}>{tab.label}</button>
        ))}
      </div>

      {activeTab === 'multi' ? (
        <div>
          {/* CGPA Result Banner */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-active)',
            borderRadius: '20px', padding: '28px 32px', marginBottom: '24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '24px', flexWrap: 'wrap', position: 'relative', overflow: 'hidden',
            boxShadow: `0 0 40px ${cgpaColor}15`,
          }}>
            {/* Background glow */}
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: `radial-gradient(circle, ${cgpaColor}15, transparent)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${cgpaColor}, transparent)` }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              {/* Big CGPA circle */}
              <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
                <svg viewBox="0 0 130 130" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="65" cy="65" r="55" fill="none" stroke="var(--bg-surface)" strokeWidth="10" />
                  <circle cx="65" cy="65" r="55" fill="none" stroke={cgpaColor} strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 55}`}
                    strokeDashoffset={`${2 * Math.PI * 55 * (1 - cgpa / 10)}`}
                    style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1)', filter: `drop-shadow(0 0 8px ${cgpaColor})` }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display, Syne, sans-serif)', fontWeight: '900', fontSize: '28px', color: cgpaColor, lineHeight: 1, animation: 'countUp 0.5s ease' }}>{cgpa.toFixed(2)}</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>CGPA</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', marginBottom: '6px' }}>Overall Performance</div>
                <div style={{ fontFamily: 'var(--font-display, Syne, sans-serif)', fontSize: '32px', fontWeight: '800', color: cgpaColor, marginBottom: '6px', lineHeight: 1 }}>{cgpaLabel}</div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{semesters.length} Semesters</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>•</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{semesters.flatMap(s => s.subjects).length} Subjects</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>•</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{semesters.flatMap(s => s.subjects).reduce((a, s) => a + Number(s.credits), 0)} Credits</span>
                </div>
              </div>
            </div>

            {/* Semester GPAs mini */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {semesters.map(sem => {
                const gpa = parseFloat(calcSemGPA(sem.subjects));
                const c = gpa >= 9 ? '#00e5ff' : gpa >= 8 ? '#10b981' : gpa >= 7 ? '#a78bfa' : gpa >= 6 ? '#f59e0b' : '#f43f5e';
                return (
                  <div key={sem.id} style={{ textAlign: 'center', padding: '10px 14px', background: 'var(--bg-surface)', borderRadius: '12px', border: `1px solid ${c}30`, minWidth: '60px' }}>
                    <div style={{ fontFamily: 'var(--font-display, Syne, sans-serif)', fontSize: '18px', fontWeight: '800', color: c }}>{gpa.toFixed(1)}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>{sem.name.replace('Semester ', 'S')}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grade Reference */}
          <div className="card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', marginBottom: '12px' }}>Grade Reference Chart</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {GRADE_OPTIONS.map(g => (
                <div key={g} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '8px', background: `${GRADE_COLORS[g]}12`, border: `1px solid ${GRADE_COLORS[g]}25` }}>
                  <span style={{ fontFamily: 'var(--font-display, Syne, sans-serif)', fontWeight: '800', color: GRADE_COLORS[g], fontSize: '13px' }}>{g}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>= {GRADE_POINTS[g]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Semesters */}
          {semesters.map((sem, semIdx) => {
            const semGPA = parseFloat(calcSemGPA(sem.subjects));
            const semColor = semGPA >= 9 ? '#00e5ff' : semGPA >= 8 ? '#10b981' : semGPA >= 7 ? '#a78bfa' : semGPA >= 6 ? '#f59e0b' : '#f43f5e';
            return (
              <div key={sem.id} className="card stagger-1" style={{ marginBottom: '16px', padding: '20px' }}>
                {/* Sem header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '28px', borderRadius: '4px', background: `linear-gradient(to bottom, var(--accent-1), var(--accent-2))`, flexShrink: 0 }} />
                    <input
                      value={sem.name}
                      onChange={e => updateSemName(sem.id, e.target.value)}
                      style={{ background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font-display, Syne, sans-serif)', fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', cursor: 'text' }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-display, Syne, sans-serif)', fontSize: '24px', fontWeight: '900', color: semColor, lineHeight: 1 }}>{semGPA.toFixed(2)}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>SEM GPA</div>
                    </div>
                    {semesters.length > 1 && (
                      <button onClick={() => removeSemester(sem.id)}
                        style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '8px', color: '#f43f5e', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center' }}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Column headers */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 36px', gap: '8px', marginBottom: '8px', padding: '0 4px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Subject Name</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Credits</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Grade</div>
                  <div />
                </div>

                {/* Subjects */}
                {sem.subjects.map(sub => (
                  <div key={sub.id} className="grade-row-calc" style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 36px', gap: '8px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', animation: 'fadeIn .3s ease' }}>
                    <input className="form-input" style={{ padding: '8px 12px', fontSize: '13px' }}
                      placeholder="Subject name (optional)"
                      value={sub.name}
                      onChange={e => updateSubject(sem.id, sub.id, 'name', e.target.value)} />
                    <input className="form-input" style={{ padding: '8px 10px', fontSize: '13px', textAlign: 'center' }}
                      type="number" min="1" max="6" value={sub.credits}
                      onChange={e => updateSubject(sem.id, sub.id, 'credits', e.target.value)} />
                    <select className="form-input" style={{ padding: '8px 10px', fontSize: '13px', color: GRADE_COLORS[sub.grade], fontWeight: '700', fontFamily: 'var(--font-display, Syne, sans-serif)' }}
                      value={sub.grade}
                      onChange={e => updateSubject(sem.id, sub.id, 'grade', e.target.value)}>
                      {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g} ({GRADE_POINTS[g]})</option>)}
                    </select>
                    <button onClick={() => removeSubject(sem.id, sub.id)}
                      disabled={sem.subjects.length <= 1}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '6px', transition: 'all 0.15s', display: 'flex', alignItems: 'center' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#f43f5e'; e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}

                {/* Add subject */}
                <button onClick={() => addSubject(sem.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', padding: '7px 14px', background: 'var(--accent-glow)', border: '1px dashed var(--border-active)', borderRadius: '9px', color: 'var(--accent-1)', cursor: 'pointer', fontSize: '12px', fontWeight: '600', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background = `color-mix(in srgb, var(--accent-1) 12%, transparent)`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-glow)'; }}>
                  <Plus size={13} /> Add Subject
                </button>
              </div>
            );
          })}

          <button className="btn btn-secondary" onClick={addSemester} style={{ width: '100%', justifyContent: 'center', borderStyle: 'dashed', marginBottom: '24px' }}>
            <Plus size={15} /> Add Semester
          </button>
        </div>
      ) : (
        /* SINGLE SEMESTER */
        <div>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-active)',
            borderRadius: '20px', padding: '28px 32px', marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap',
            position: 'relative', overflow: 'hidden',
            boxShadow: `0 0 40px ${(singleGPA >= 9 ? '#00e5ff' : singleGPA >= 7 ? '#10b981' : '#f59e0b')}15`,
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent-1), transparent)' }} />
            <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
              {(() => {
                const c = singleGPA >= 9 ? '#00e5ff' : singleGPA >= 8 ? '#10b981' : singleGPA >= 7 ? '#a78bfa' : singleGPA >= 6 ? '#f59e0b' : '#f43f5e';
                return (
                  <>
                    <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                      <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-surface)" strokeWidth="9" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke={c} strokeWidth="9" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        strokeDashoffset={`${2 * Math.PI * 50 * (1 - singleGPA / 10)}`}
                        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1)', filter: `drop-shadow(0 0 6px ${c})` }}
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-display, Syne, sans-serif)', fontWeight: '900', fontSize: '26px', color: c, lineHeight: 1 }}>{singleGPA.toFixed(2)}</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>GPA</div>
                    </div>
                  </>
                );
              })()}
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', marginBottom: '6px' }}>Semester GPA</div>
              {(() => {
                const c = singleGPA >= 9 ? '#00e5ff' : singleGPA >= 8 ? '#10b981' : singleGPA >= 7 ? '#a78bfa' : singleGPA >= 6 ? '#f59e0b' : '#f43f5e';
                const l = singleGPA >= 9 ? 'Outstanding!' : singleGPA >= 8 ? 'Excellent!' : singleGPA >= 7 ? 'Very Good' : singleGPA >= 6 ? 'Good' : 'Keep Going!';
                return <div style={{ fontFamily: 'var(--font-display, Syne, sans-serif)', fontSize: '28px', fontWeight: '800', color: c, lineHeight: 1 }}>{l}</div>;
              })()}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{singleSubjects.length} Subjects</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>•</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{singleSubjects.reduce((a, s) => a + Number(s.credits), 0)} Credits</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 36px', gap: '8px', marginBottom: '12px', padding: '0 4px' }}>
              {['Subject Name', 'Credits', 'Grade', ''].map((h, i) => (
                <div key={i} style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</div>
              ))}
            </div>
            {singleSubjects.map(sub => (
              <div key={sub.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 36px', gap: '8px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', animation: 'fadeIn .3s ease' }}>
                <input className="form-input" style={{ padding: '8px 12px', fontSize: '13px' }}
                  placeholder="Subject name"
                  value={sub.name}
                  onChange={e => updateSingle(sub.id, 'name', e.target.value)} />
                <input className="form-input" style={{ padding: '8px 10px', fontSize: '13px', textAlign: 'center' }}
                  type="number" min="1" max="6" value={sub.credits}
                  onChange={e => updateSingle(sub.id, 'credits', e.target.value)} />
                <select className="form-input" style={{ padding: '8px 10px', fontSize: '13px', color: GRADE_COLORS[sub.grade], fontWeight: '700', fontFamily: 'var(--font-display, Syne, sans-serif)' }}
                  value={sub.grade}
                  onChange={e => updateSingle(sub.id, 'grade', e.target.value)}>
                  {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g} ({GRADE_POINTS[g]})</option>)}
                </select>
                <button onClick={() => removeSingle(sub.id)} disabled={singleSubjects.length <= 1}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f43f5e'; e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            <button onClick={addSingle}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', padding: '7px 14px', background: 'var(--accent-glow)', border: '1px dashed var(--border-active)', borderRadius: '9px', color: 'var(--accent-1)', cursor: 'pointer', fontSize: '12px', fontWeight: '600', fontFamily: 'DM Sans, sans-serif' }}>
              <Plus size={13} /> Add Subject
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes countUp{from{opacity:0;transform:scale(0.6)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}
