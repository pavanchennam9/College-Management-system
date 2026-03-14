import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeSwitcher from './ThemeSwitcher';
import { LayoutDashboard, Users, GraduationCap, BookOpen, CreditCard, Bell, Calendar, User, LogOut, ClipboardList, BarChart3, Briefcase, Menu } from 'lucide-react';

const NAV = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/students', label: 'Students', icon: GraduationCap },
    { to: '/admin/faculty', label: 'Faculty', icon: Users },
    { to: '/admin/courses', label: 'Courses', icon: BookOpen },
    { to: '/admin/fees', label: 'Fees', icon: CreditCard },
    { to: '/admin/placements', label: 'Placements', icon: Briefcase },
    { to: '/admin/notices', label: 'Notices', icon: Bell },
    { to: '/admin/timetable', label: 'Timetable', icon: Calendar },
    { to: '/admin/profile', label: 'Profile', icon: User },
  ],
  faculty: [
    { to: '/faculty', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/faculty/attendance', label: 'Attendance', icon: ClipboardList },
    { to: '/faculty/grades', label: 'Grades', icon: BarChart3 },
    { to: '/faculty/placements', label: 'Placements', icon: Briefcase },
    { to: '/faculty/notices', label: 'Notices', icon: Bell },
    { to: '/faculty/timetable', label: 'Timetable', icon: Calendar },
    { to: '/faculty/profile', label: 'Profile', icon: User },
  ],
  student: [
    { to: '/student', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/student/grades', label: 'My Grades', icon: BarChart3 },
    { to: '/student/attendance', label: 'Attendance', icon: ClipboardList },
    { to: '/student/fees', label: 'Fees', icon: CreditCard },
    { to: '/student/placements', label: 'Placements', icon: Briefcase },
    { to: '/student/notices', label: 'Notices', icon: Bell },
    { to: '/student/timetable', label: 'Timetable', icon: Calendar },
    { to: '/student/profile', label: 'Profile', icon: User },
  ],
};

const ROLE_COLOR = { admin: '#f43f5e', faculty: '#7c3aed', student: '#00e5ff' };
const ROLE_BG = { admin: 'rgba(244,63,94,0.1)', faculty: 'rgba(124,58,237,0.1)', student: 'rgba(0,229,255,0.1)' };

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, setTheme, themes } = useTheme();
  const navigate = useNavigate();
  const navItems = NAV[user?.role] || [];

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(!isMobile);

  const handleLogout = () => { logout(); navigate('/login'); };

  useEffect(() => {
    const handler = () => {
      const m = window.innerWidth < 768;
      setIsMobile(m);
      if (!m) setMenuOpen(true);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {isMobile && menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40 }}
        />
      )}

      <aside
        style={{
          width: '240px',
          minHeight: '100vh',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 50,
          transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform .25s ease',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', overflow: 'hidden', background: 'white', padding: '2px', flexShrink: 0, boxShadow: '0 0 12px rgba(0,229,255,0.3)' }}>
              <img src="/logo.jpeg" alt="EduNexus" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '15px', background: 'linear-gradient(135deg, #00e5ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EduNexus</div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Management System</div>
            </div>
          </div>
        </div>

        {/* User info */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: ROLE_BG[user?.role], border: `1px solid ${ROLE_COLOR[user?.role]}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ROLE_COLOR[user?.role], fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <span style={{ fontSize: '10px', padding: '1px 7px', borderRadius: '100px', background: ROLE_BG[user?.role], color: ROLE_COLOR[user?.role], border: `1px solid ${ROLE_COLOR[user?.role]}30`, textTransform: 'capitalize', fontWeight: '600' }}>{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '10px 10px', overflowY: 'auto' }}>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.exact}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px',
                borderRadius: 'var(--radius-sm)', marginBottom: '2px', textDecoration: 'none',
                fontSize: '13px', fontWeight: isActive ? '600' : '400',
                color: isActive ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(0,229,255,0.08)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--neon-cyan)' : '2px solid transparent',
                transition: 'all 0.15s ease',
              })}>
              <item.icon size={15} />
              {!isMobile && item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', transition: 'all 0.15s ease' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f43f5e'; e.currentTarget.style.background = 'rgba(244,63,94,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: '240px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '56px', background: 'var(--bg-glass)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isMobile && (
              <button
                onClick={() => setMenuOpen(o => !o)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px' }}
              >
                <Menu size={20} color="var(--text-muted)" />
              </button>
            )}
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ThemeSwitcher />
            {user?.department && <span style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '3px 10px', background: 'var(--bg-surface)', borderRadius: '100px', border: '1px solid var(--border-subtle)' }}>{user.department}</span>}
            {user?.rollNumber && <span className="badge badge-cyan">{user.rollNumber}</span>}
            {user?.employeeId && <span className="badge badge-violet">{user.employeeId}</span>}
          </div>
        </header>
        <div style={{ flex: 1, padding: '28px', animation: 'fadeIn 0.3s ease' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
