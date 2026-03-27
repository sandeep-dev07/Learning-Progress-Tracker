import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { INITIAL_USERS, INITIAL_MODULES, INITIAL_TASKS, INITIAL_PROGRESS } from './constants';
import { Sidebar } from './components/Sidebar';
import { ToastDisplay } from './components/UI';
import { LoginForm, RegisterForm } from './pages/Auth';
import { StudentDashboard, StudentModules, StudentTasks, StudentProgress } from './pages/StudentViews';
import { TeacherDashboard, TeacherStudents, TeacherModules, TeacherTasks } from './pages/TeacherViews';

function App() {
  const [users, setUsers] = useState(() => { const v = localStorage.getItem('lt_users'); return v ? JSON.parse(v) : INITIAL_USERS; });
  const [modules, setModules] = useState(() => { const v = localStorage.getItem('lt_modules'); return v ? JSON.parse(v) : INITIAL_MODULES; });
  const [tasks, setTasks] = useState(() => { const v = localStorage.getItem('lt_tasks'); return v ? JSON.parse(v) : INITIAL_TASKS; });
  const [progress, setProgress] = useState(() => { const v = localStorage.getItem('lt_progress'); return v ? JSON.parse(v) : INITIAL_PROGRESS; });
  const [currentUser, setCurrentUser] = useState(() => { const v = localStorage.getItem('lt_curUser'); return v ? JSON.parse(v) : null; });
  const [page, setPage] = useState(() => localStorage.getItem('lt_curUser') ? 'app' : 'login');
  const [view, setView] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg, type = 'success') => setToast({ msg, type, id: Date.now() }), []);

  useEffect(() => { localStorage.setItem('lt_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('lt_modules', JSON.stringify(modules)); }, [modules]);
  useEffect(() => { localStorage.setItem('lt_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('lt_progress', JSON.stringify(progress)); }, [progress]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('lt_curUser', JSON.stringify(currentUser));
    else localStorage.removeItem('lt_curUser');
  }, [currentUser]);

  const students = useMemo(() => users.filter(u => u.role === 'student'), [users]);

  const handleLogin = useCallback((user) => {
    setCurrentUser(user);
    setView('dashboard');
    setPage('app');
    showToast(`Welcome back, ${user.name.split(' ')[0]}!`, 'success');
  }, [showToast]);

  const handleRegister = useCallback((newUser) => {
    setUsers(prev => [...prev, newUser]);
    if (newUser.role === 'student') setProgress(prev => ({ ...prev, [newUser.id]: {} }));
    showToast('Account created successfully!', 'success');
    handleLogin(newUser);
  }, [handleLogin, showToast]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setPage('login');
  }, []);

  const handleToggleTask = useCallback((taskId) => {
    if (!currentUser) return;
    setProgress(prev => {
      const isDone = !prev[currentUser.id]?.[taskId];
      if (isDone) showToast('Task completed! Awesome job.', 'success');
      return {
        ...prev,
        [currentUser.id]: {
          ...prev[currentUser.id],
          [taskId]: isDone
        }
      };
    });
  }, [currentUser, showToast]);

  if (page === 'login') return <><LoginForm users={users} onLogin={handleLogin} switchToRegister={() => setPage('register')} /><ToastDisplay toast={toast} onClose={() => setToast(null)} /></>;
  if (page === 'register') return <><RegisterForm onRegister={handleRegister} switchToLogin={() => setPage('login')} /><ToastDisplay toast={toast} onClose={() => setToast(null)} /></>;
  if (!currentUser) return null;

  const renderView = () => {
    if (currentUser.role === 'student') {
      const props = { user: currentUser, tasks, modules, progress, onToggle: handleToggleTask };
      switch (view) {
        case 'dashboard': return <StudentDashboard {...props} />;
        case 'modules': return <StudentModules {...props} setView={setView} />;
        case 'tasks': return <StudentTasks {...props} />;
        case 'progress': return <StudentProgress {...props} />;
        default: return <StudentDashboard {...props} />;
      }
    } else {
      const props = { user: currentUser, students, tasks, modules, progress };
      switch (view) {
        case 'dashboard':
          return <TeacherDashboard {...props} />;

        case 'students':
          return <TeacherStudents {...props} />; // ✅ ADDED

        case 'modules':
          return <TeacherModules {...props} setModules={setModules} setTasks={setTasks} showToast={showToast} />;

        case 'tasks':
          return <TeacherTasks {...props} setTasks={setTasks} setProgress={setProgress} showToast={showToast} />;

        default:
          return <TeacherDashboard {...props} />;
      }
    }
  };

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <Sidebar user={currentUser} view={view} setView={setView} onLogout={handleLogout} />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', maxHeight: '100vh' }} aria-label="Main content">
        {renderView()}
      </main>
      <ToastDisplay toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
