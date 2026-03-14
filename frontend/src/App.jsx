import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import usePersistentState from './utils/usePersistentState';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import SplashScreen from './components/SplashScreen';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Layout';
import AdminDashboard from './pages/admin/Dashboard';
import StudentsPage from './pages/admin/Students';
import FacultyPage from './pages/admin/Faculty';
import CoursesPage from './pages/admin/Courses';
import FeesPage from './pages/admin/Fees';
import NoticesPage from './pages/shared/Notices';
import TimetablePage from './pages/shared/Timetable';
import PlacementsPage from './pages/shared/Placements';
import StudentDashboard from './pages/student/Dashboard';
import StudentGrades from './pages/student/Grades';
import StudentAttendance from './pages/student/Attendance';
import StudentFees from './pages/student/Fees';
import FacultyDashboard from './pages/faculty/Dashboard';
import AttendancePage from './pages/faculty/Attendance';
import GradesPage from './pages/faculty/Grades';
import ProfilePage from './pages/shared/Profile';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'faculty') return <Navigate to="/faculty" replace />;
  return <Navigate to="/student" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Layout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="faculty" element={<FacultyPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="fees" element={<FeesPage />} />
        <Route path="notices" element={<NoticesPage />} />
        <Route path="timetable" element={<TimetablePage />} />
        <Route path="placements" element={<PlacementsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="/faculty" element={<ProtectedRoute roles={['faculty']}><Layout /></ProtectedRoute>}>
        <Route index element={<FacultyDashboard />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="grades" element={<GradesPage />} />
        <Route path="notices" element={<NoticesPage />} />
        <Route path="timetable" element={<TimetablePage />} />
        <Route path="placements" element={<PlacementsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="/student" element={<ProtectedRoute roles={['student']}><Layout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="grades" element={<StudentGrades />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="fees" element={<StudentFees />} />
        <Route path="notices" element={<NoticesPage />} />
        <Route path="timetable" element={<TimetablePage />} />
        <Route path="placements" element={<PlacementsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  // show splash on every load; we don't persist state any longer
  const [splashDone, setSplashDone] = useState(false);
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ style: { background: '#0c1220', color: '#f0f6ff', border: '1px solid rgba(0,229,255,0.2)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }, success: { iconTheme: { primary: '#10b981', secondary: '#0c1220' } }, error: { iconTheme: { primary: '#f43f5e', secondary: '#0c1220' } } }} />
          {!splashDone ? <SplashScreen onDone={() => setSplashDone(true)} /> : <AppRoutes />}
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
