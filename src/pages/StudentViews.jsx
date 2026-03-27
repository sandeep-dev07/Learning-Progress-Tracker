import React, { useState, useEffect, useMemo } from 'react';
import { calcProgress, mockApi, MODULE_COLORS } from '../constants';
import { Loading, ErrorState, EmptyState, DonutChart, ProgressBar, LineChartComp, TaskCard, FilterPanel } from '../components/UI';

export const StudentDashboard = ({ user, tasks, modules, progress, onToggle }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  useEffect(() => {
    setLoading(true); setError(null);
    mockApi(() => {
      const myTasks = tasks;
      const done = myTasks.filter(t => progress[user.id]?.[t.id]);
      const pts = done.reduce((s,t) => s + t.points, 0);
      const total = myTasks.reduce((s,t) => s + t.points, 0);
      return { myTasks, done, pts, total };
    }).then(setData).catch(()=>setError('Failed to load dashboard')).finally(()=>setLoading(false));
  }, [user.id, tasks, progress]);
  if (loading) return <Loading />;
  if (error) return <ErrorState msg={error} onRetry={() => setLoading(true)} />;
  const pct = calcProgress(user.id, tasks, progress);
  return (
    <div className="fade-in">
      <div className="mb-6"><h1 className="text-xl font-bold">Welcome back, {user.name.split(' ')[0]} 👋</h1><p className="text-secondary text-sm mt-1">Track your learning journey</p></div>
      <div className="grid-4 mb-4">
        {[
          { label:'Overall Progress', val:`${pct}%`, color:'var(--accent-teal)' },
          { label:'Tasks Done', val:`${data.done.length}/${data.myTasks.length}`, color:'var(--accent-blue)' },
          { label:'Points Earned', val:data.pts, color:'var(--accent-amber)' },
          { label:'Modules', val:modules.length, color:'var(--accent-purple)' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-num" style={{color:s.color}}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="grid-2 mb-4">
        <div className="card">
          <p className="text-sm font-semibold mb-3">Overall Progress</p>
          <div className="flex items-center gap-4">
            <DonutChart value={pct} />
            <div>
              <p className="text-2xl font-bold text-teal">{pct}%</p>
              <p className="text-secondary text-sm">{data.done.length} of {data.myTasks.length} tasks</p>
              <p className="text-muted text-xs mt-1">{data.pts} / {data.total} points</p>
            </div>
          </div>
        </div>
        <div className="card">
          <p className="text-sm font-semibold mb-3">Module Progress</p>
          {modules.map(m => {
            const mt = tasks.filter(t => t.moduleId===m.id);
            const mp = mt.length ? Math.round((mt.filter(t=>progress[user.id]?.[t.id]).length/mt.length)*100) : 0;
            return (
              <div key={m.id} className="mb-3">
                <div className="flex justify-between mb-1"><span className="text-xs text-secondary">{m.title}</span><span className="text-xs font-semibold" style={{color:MODULE_COLORS[m.color]}}>{mp}%</span></div>
                <ProgressBar value={mp} color={m.color} height={5} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="card">
        <p className="text-sm font-semibold mb-3">Progress Over Modules</p>
        <LineChartComp modules={modules} userId={user.id} tasks={tasks} progress={progress} />
      </div>
    </div>
  );
};

export const StudentTasks = ({ user, tasks, modules, progress, onToggle }) => {
  const [filter, setFilter] = useState({ module:'', status:'' });
  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (filter.module && t.moduleId !== filter.module) return false;
      const done = progress[user.id]?.[t.id];
      if (filter.status === 'completed' && !done) return false;
      if (filter.status === 'pending' && done) return false;
      return true;
    });
  }, [tasks, user.id, filter, progress]);
  return (
    <div className="fade-in">
      <div className="mb-4"><h2 className="text-lg font-bold">All Tasks</h2><p className="text-secondary text-sm">Your assigned tasks across all modules</p></div>
      <FilterPanel filter={filter} setFilter={setFilter} modules={modules} />
      {filtered.length === 0 ? <EmptyState msg="No tasks match your filters" icon="task" /> : (
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {filtered.map(t => <TaskCard key={t.id} task={t} module={modules.find(m=>m.id===t.moduleId)} completed={!!progress[user.id]?.[t.id]} onToggle={onToggle} role="student" />)}
        </div>
      )}
    </div>
  );
};

export const StudentModules = ({ user, tasks, modules, progress, onToggle }) => (
  <div className="fade-in">
    <div className="mb-4"><h2 className="text-lg font-bold">My Modules</h2><p className="text-secondary text-sm">Your learning modules</p></div>
    {modules.length === 0 ? <EmptyState msg="No modules assigned yet" /> : (
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        {modules.map(m => {
          const mt = tasks.filter(t => t.moduleId===m.id);
          const done = mt.filter(t => progress[user.id]?.[t.id]);
          const pct = mt.length ? Math.round((done.length/mt.length)*100) : 0;
          return (
            <div key={m.id} className="card fade-in" style={{borderLeft:`3px solid ${MODULE_COLORS[m.color]}`}}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold">{m.title}</p>
                  <p className="text-xs text-secondary mt-1">{m.description}</p>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <p className="font-bold" style={{color:MODULE_COLORS[m.color],fontSize:20}}>{pct}%</p>
                  <p className="text-xs text-muted">{done.length}/{mt.length} tasks</p>
                </div>
              </div>
              <ProgressBar value={pct} color={m.color} height={6} />
              <div className="mt-3" style={{display:'flex',flexDirection:'column',gap:6}}>
                {mt.map(t => <TaskCard key={t.id} task={t} module={m} completed={!!progress[user.id]?.[t.id]} onToggle={onToggle} role="student" />)}
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export const StudentProgress = ({ user, tasks, modules, progress }) => {
  const pct = calcProgress(user.id, tasks, progress);
  const myTasks = tasks;
  const done = myTasks.filter(t => progress[user.id]?.[t.id]);
  const pts = done.reduce((s,t) => s+t.points, 0);
  return (
    <div className="fade-in">
      <div className="mb-4"><h2 className="text-lg font-bold">My Progress</h2></div>
      <div className="card mb-4" style={{display:'flex',alignItems:'center',gap:24}}>
        <DonutChart value={pct} size={120} />
        <div>
          <p className="text-2xl font-bold text-teal">{pct}% Complete</p>
          <p className="text-secondary text-sm">{done.length} tasks done · {pts} points earned</p>
        </div>
      </div>
      {modules.map(m => {
        const mt = tasks.filter(t => t.moduleId===m.id);
        const d = mt.filter(t => progress[user.id]?.[t.id]);
        const p = mt.length ? Math.round((d.length/mt.length)*100) : 0;
        return (
          <div key={m.id} className="card mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{m.title}</span>
              <span className="font-bold" style={{color:MODULE_COLORS[m.color]}}>{p}%</span>
            </div>
            <ProgressBar value={p} color={m.color} height={8} />
            <p className="text-xs text-muted mt-2">{d.length} / {mt.length} tasks completed</p>
          </div>
        );
      })}
    </div>
  );
};
