import { useEffect, useState } from 'react';

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('enter'); // enter | hold | exit

  useEffect(() => {
    // total splash visible time ~2 seconds before handing control back
    const t1 = setTimeout(() => setPhase('hold'), 200);
    const t2 = setTimeout(() => setPhase('exit'), 1800);
    const t3 = setTimeout(() => onDone(), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'radial-gradient(ellipse at center, #050b14 0%, #020408 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 0.6s ease',
      opacity: phase === 'exit' ? 0 : 1,
    }}>
      {/* Ambient glow rings (animation continues but splash itself completes in 2s) */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)', animation: 'splashPulse 2s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '400px', height: '400px', borderRadius: '50%', border: '1px solid rgba(0,229,255,0.08)', animation: 'splashRing 3s linear infinite' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '500px', borderRadius: '50%', border: '1px solid rgba(124,58,237,0.06)', animation: 'splashRing 4s linear infinite reverse' }} />
      </div>

      {/* Logo container */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px',
        transform: phase === 'enter' ? 'scale(0.7) translateY(20px)' : phase === 'exit' ? 'scale(1.05) translateY(-10px)' : 'scale(1) translateY(0)',
        opacity: phase === 'enter' ? 0 : phase === 'exit' ? 0 : 1,
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {/* Logo image with glow frame */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: '-20px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 70%)', animation: 'splashGlow 1.5s ease-in-out infinite alternate' }} />
          <div style={{ width: '180px', height: '180px', borderRadius: '32px', overflow: 'hidden', background: 'white', padding: '12px', boxShadow: '0 0 60px rgba(0,229,255,0.25), 0 0 120px rgba(0,229,255,0.1), 0 20px 60px rgba(0,0,0,0.8)', position: 'relative' }}>
            <img src="/logo.jpeg" alt="EduNexus" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '20px' }} />
          </div>
        </div>

        {/* Text */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '42px', fontWeight: '900', background: 'linear-gradient(135deg, #00e5ff 0%, #2563eb 40%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em', marginBottom: '8px', lineHeight: 1 }}>
            EduNexus
          </div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(148,163,184,0.8)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '300' }}>
            College Management System
          </div>
        </div>

        {/* Loading dots */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--neon-cyan)', animation: `splashDot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes splashPulse { 0%,100% { transform: translate(-50%,-50%) scale(1); opacity:0.6; } 50% { transform: translate(-50%,-50%) scale(1.1); opacity:1; } }
        @keyframes splashRing { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes splashGlow { from { opacity:0.5; transform:scale(0.9); } to { opacity:1; transform:scale(1.1); } }
        @keyframes splashDot { 0%,80%,100% { transform:scale(0.6); opacity:0.3; } 40% { transform:scale(1); opacity:1; } }
      `}</style>
    </div>
  );
}
