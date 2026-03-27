import React, { useState, useEffect, useMemo } from 'react';
import { calcProgress, mockApi, uid, MODULE_COLORS } from '../constants';
import { Loading, ErrorState, EmptyState, DonutChart, ProgressBar, BarChartComp, TaskCard, FilterPanel, Icon } from '../components/UI';

export const TeacherDashboard = ({ user, students, tasks, modules, progress }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  useEffect(() => {
    setLoading(true);
    mockApi(() => {
      const avgCompletion = students.length ? Math.round(students.reduce((s, st) => s + calcProgress(st.id, tasks, progress), 0) / students.length) : 0;
      return { avgCompletion };
    }).then(setStats).finally(() => setLoading(false));
  }, [students, tasks, progress]);
  if (loading) return <Loading />;
  return (
    <div className="fade-in">
      <div className="mb-6"><h1 className="text-xl font-bold">Teacher Overview</h1><p className="text-secondary text-sm mt-1">Monitor class progress and manage content</p></div>
      <div className="grid-2 mb-4">
        {[
          { label: 'Avg Completion', val: `${stats.avgCompletion}%`, color: 'var(--accent-teal)' },
          { label: 'Active Modules', val: modules.length, color: 'var(--accent-purple)' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-num" style={{ color: s.color }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="grid-2 mb-4">
        <div className="card">
          <p className="text-sm font-semibold mb-3">Class Average</p>
          <div className="flex items-center gap-4">
            <DonutChart value={stats.avgCompletion} color="#4f8ef7" />
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--accent-blue)' }}>{stats.avgCompletion}%</p>
              <p className="text-secondary text-sm">class average</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TeacherStudents = ({ students, tasks, modules, progress }) => (
  <div className="fade-in">
    <div className="mb-4"><h2 className="text-lg font-bold">Students</h2><p className="text-secondary text-sm">Individual student progress</p></div>
    {students.length === 0 ? <EmptyState msg="No students enrolled" icon="users" /> : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {students.map(s => {
          const pct = calcProgress(s.id, tasks, progress);
          const mt = tasks;
          const done = mt.filter(t => progress[s.id]?.[t.id]);
          const pts = done.reduce((sum, t) => sum + t.points, 0);
          return (
            <div key={s.id} className="card fade-in">
              <div className="flex items-center gap-3 mb-3">
                <div className="avatar" style={{ background: s.color + '22', color: s.color }}>{s.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{s.name}</p>
                    <span className="font-bold" style={{ color: s.color }}>{pct}%</span>
                  </div>
                  <p className="text-xs text-muted">{done.length}/{mt.length} tasks · {pts} pts</p>
                </div>
              </div>
              <ProgressBar value={pct} height={6} />
              <div className="mt-3 grid-2">
                {modules.map(m => {
                const mmt = tasks.filter(t => t.moduleId === m.id);
                  const mp = mmt.length ? Math.round((mmt.filter(t => progress[s.id]?.[t.id]).length / mmt.length) * 100) : 0;
                  return (
                    <div key={m.id} className="mt-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-muted">{m.title.split(' ')[0]}</span>
                        <span className="text-xs" style={{ color: MODULE_COLORS[m.color] }}>{mp}%</span>
                      </div>
                      <ProgressBar value={mp} color={m.color} height={4} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export const TeacherModules = ({ user, modules, tasks, setModules, setTasks, students, showToast }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', color: 'teal' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleAdd = async () => {
    if (!form.title.trim()) { setError('Title is required'); return; }
    setLoading(true);
    await mockApi(() => {
      const nm = { id: uid(), title: form.title, description: form.description, color: form.color, teacherId: user.id, totalTasks: 0 };
      setModules(prev => [...prev, nm]);
      setForm({ title: '', description: '', color: 'teal' });
      setShowForm(false);
      showToast('Module created successfully!', 'success');
    });
    setLoading(false);
  };
  const handleDelete = (mid) => {
    setModules(prev => prev.filter(m => m.id !== mid));
    setTasks(prev => prev.filter(t => t.moduleId !== mid));
  };
  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-4">
        <div><h2 className="text-lg font-bold">Modules</h2><p className="text-secondary text-sm">Manage learning modules</p></div>
        <button className="btn-primary btn-sm flex items-center gap-2" onClick={() => { setShowForm(s => !s); setError(''); }} aria-expanded={showForm}>
          <Icon name="plus" size={14} color="#0f1117" /> New Module
        </button>
      </div>
      {showForm && (
        <div className="card mb-4 fade-in" style={{ borderColor: 'var(--accent-teal)' }}>
          <p className="font-semibold mb-3">Create Module</p>
          {error && <p className="text-red text-xs mb-2" role="alert">{error}</p>}
          <div className="mb-3"><label htmlFor="mod-title">Title</label><input id="mod-title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Module title" /></div>
          <div className="mb-3"><label htmlFor="mod-desc">Description</label><input id="mod-desc" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description" /></div>
          <div className="mb-3">
            <label htmlFor="mod-color">Color</label>
            <select id="mod-color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}>
              {Object.entries(MODULE_COLORS).map(([k]) => <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button className="btn-primary btn-sm" onClick={handleAdd} disabled={loading} aria-busy={loading}>{loading ? 'Creating...' : 'Create'}</button>
            <button className="btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      {modules.length === 0 ? <EmptyState msg="No modules yet — create one!" /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {modules.map(m => {
            const mt = tasks.filter(t => t.moduleId === m.id);
            return (
              <div key={m.id} className="card fade-in" style={{ borderLeft: `3px solid ${MODULE_COLORS[m.color]}` }}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{m.title}</p>
                    <p className="text-xs text-secondary mt-1">{m.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="tag">{mt.length} tasks</span>
                    </div>
                  </div>
                  <button className="btn-danger btn-sm" onClick={() => handleDelete(m.id)} aria-label={`Delete ${m.title}`}>
                    <Icon name="trash" size={13} color="var(--accent-red)" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const TeacherTasks = ({ user, tasks, modules, students, setTasks, progress, setProgress, showToast }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', moduleId: '', points: '10' });
  const [filter, setFilter] = useState({ module: '', status: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleAdd = async () => {
    if (!form.title.trim()) { setError('Title required'); return; }
    if (!form.moduleId) { setError('Select a module'); return; }
    setLoading(true);
    await mockApi(() => {
      const nt = { id: uid(), moduleId: form.moduleId, title: form.title, description: form.description, points: parseInt(form.points) || 10 };
      setTasks(prev => [...prev, nt]);
      setForm({ title: '', description: '', moduleId: '', points: '10' });
      setShowForm(false);
      showToast('Task added successfully!', 'success');
    });
    setLoading(false);
  };
  const handleDelete = (tid) => {
    setTasks(prev => prev.filter(t => t.id !== tid));
    setProgress(prev => {
      const np = { ...prev };
      Object.keys(np).forEach(uid => { const { [tid]: _, ...rest } = np[uid]; np[uid] = rest; });
      return np;
    });
  };
  const filtered = useMemo(() => tasks.filter(t => {
    if (filter.module && t.moduleId !== filter.module) return false;
    return true;
  }), [tasks, filter]);
  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-4">
        <div><h2 className="text-lg font-bold">Manage Tasks</h2><p className="text-secondary text-sm">Create and assign tasks to students</p></div>
        <button className="btn-primary btn-sm flex items-center gap-2" onClick={() => { setShowForm(s => !s); setError(''); }}>
          <Icon name="plus" size={14} color="#0f1117" /> New Task
        </button>
      </div>
      {showForm && (
        <div className="card mb-4 fade-in" style={{ borderColor: 'var(--accent-blue)' }}>
          <p className="font-semibold mb-3">Create Task</p>
          {error && <p className="text-red text-xs mb-2" role="alert">{error}</p>}
          <div className="grid-2 mb-3">
            <div><label htmlFor="task-title">Title</label><input id="task-title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Task title" /></div>
            <div>
              <label htmlFor="task-module">Module</label>
              <select id="task-module" value={form.moduleId} onChange={e => setForm(f => ({ ...f, moduleId: e.target.value }))}>
                <option value="">Select module</option>
                {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-3"><label htmlFor="task-desc">Description</label><input id="task-desc" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Task description" /></div>
          <div className="mb-3"><label htmlFor="task-pts">Points</label><input id="task-pts" type="number" min="1" max="100" value={form.points} onChange={e => setForm(f => ({ ...f, points: e.target.value }))} style={{ width: 100 }} /></div>
          <div className="flex gap-2">
            <button className="btn-primary btn-sm" onClick={handleAdd} disabled={loading}>{loading ? 'Creating...' : 'Create Task'}</button>
            <button className="btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      <FilterPanel filter={filter} setFilter={setFilter} modules={modules} />
      {filtered.length === 0 ? <EmptyState msg="No tasks yet — create one!" icon="task" /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(t => {
            const m = modules.find(x => x.id === t.moduleId);
            return (
              <div key={t.id} className="task-card fade-in">
                <div className="flex items-start gap-3">
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{t.title}</span>
                      {m && <span className="badge" style={{ background: MODULE_COLORS[m.color] + '22', color: MODULE_COLORS[m.color], fontSize: 11 }}>{m.title}</span>}
                    </div>
                    <p className="text-xs text-secondary mb-2">{t.description}</p>
                    <div className="flex items-center gap-3">
                      <span className="tag">{t.points}pts</span>
                    </div>
                  </div>
                  <button className="btn-danger btn-sm" onClick={() => handleDelete(t.id)} aria-label={`Delete task ${t.title}`}>
                    <Icon name="trash" size={13} color="var(--accent-red)" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
