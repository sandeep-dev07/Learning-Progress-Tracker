import React, { useRef, useEffect, memo } from 'react';
import Chart from 'chart.js/auto';
import { calcProgress, MODULE_COLORS } from '../constants';

export const Icon = ({ name, size=16, color='currentColor' }) => {
  const icons = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    book: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    task: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    filter: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/></svg>,
    alert: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  };
  return icons[name] || null;
};

export const ProgressBar = memo(({ value, color='teal', height=8, showLabel=false }) => (
  <div>
    {showLabel && <div className="flex justify-between mb-1"><span className="text-xs text-muted">Progress</span><span className="text-xs font-semibold text-teal">{value}%</span></div>}
    <div className="progress-wrap" style={{height}}>
      <div className={`progress-fill progress-${color}`} style={{width:`${value}%`}} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} />
    </div>
  </div>
));

export const DonutChart = memo(({ value, size=100, color='#00d4aa' }) => {
  const r = 38; const c = 2*Math.PI*r;
  const offset = c - (value/100)*c;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#1a1d2e" strokeWidth="10"/>
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 50 50)" style={{transition:'stroke-dashoffset .5s ease'}}/>
      <text x="50" y="54" textAnchor="middle" fill={color} fontSize="16" fontWeight="700">{value}%</text>
    </svg>
  );
});

export const BarChartComp = memo(({ students, tasks, progress }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const labels = students.map(s => s.name.split(' ')[0]);
    const data = students.map(s => calcProgress(s.id, tasks, progress));
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ data, backgroundColor: students.map(s => s.color+'88'), borderColor: students.map(s => s.color), borderWidth: 2, borderRadius: 6 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, plugins: { legend:{ display:false } },
        scales: {
          y: { beginAtZero:true, max:100, ticks:{ color:'#64748b', callback:v=>v+'%' }, grid:{ color:'#2a2d3e' } },
          x: { ticks:{ color:'#94a3b8' }, grid:{ display:false } }
        }
      }
    });
    return () => { if(chartRef.current) chartRef.current.destroy(); };
  }, [students, tasks, progress]);
  return (
    <div style={{ position: 'relative', height: '180px', width: '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  );
});

export const LineChartComp = memo(({ modules, userId, tasks, progress }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const data = modules.map(m => {
      const mt = tasks.filter(t => t.moduleId === m.id);
      if (!mt.length) return 0;
      return Math.round((mt.filter(t => progress[userId]?.[t.id]).length / mt.length)*100);
    });
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: modules.map(m => m.title.split(' ')[0]),
        datasets: [{ data, borderColor:'#00d4aa', backgroundColor:'#00d4aa22', borderWidth:2, pointBackgroundColor:'#00d4aa', pointRadius:5, tension:.3, fill:true }]
      },
      options: {
        responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } },
        scales: {
          y:{ beginAtZero:true, max:100, ticks:{ color:'#64748b', callback:v=>v+'%' }, grid:{ color:'#2a2d3e' } },
          x:{ ticks:{ color:'#94a3b8' }, grid:{ display:false } }
        }
      }
    });
    return () => { if(chartRef.current) chartRef.current.destroy(); };
  }, [modules, userId, tasks, progress]);
  return (
    <div style={{ position: 'relative', height: '180px', width: '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  );
});

export const TaskCard = memo(({ task, module, completed, onToggle, role }) => (
  <div className={`task-card fade-in ${completed ? 'completed' : ''}`} role="article" aria-label={`Task: ${task.title}`}>
    <div className="flex items-center gap-3">
      {role === 'student' && (
        <button className={`checkbox ${completed ? 'checked' : ''}`} onClick={() => onToggle(task.id)}
          aria-pressed={completed} aria-label={`Mark ${task.title} as ${completed ? 'incomplete' : 'complete'}`}>
          {completed && <Icon name="check" size={11} color="#0f1117" />}
        </button>
      )}
      <div style={{flex:1}}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm" style={{textDecoration: completed ? 'line-through' : 'none', color: completed ? 'var(--text-muted)' : 'var(--text-primary)'}}>{task.title}</span>
          <span className="badge" style={{background: MODULE_COLORS[module?.color]+'22', color: MODULE_COLORS[module?.color], fontSize:11}}>{module?.title}</span>
        </div>
        <p className="text-xs text-secondary">{task.description}</p>
      </div>
      <div className="flex items-center gap-1" aria-label={`${task.points} points`}>
        <Icon name="star" size={13} color={completed ? '#fbbf24' : '#3a3f5c'} />
        <span className="text-xs" style={{color: completed ? '#fbbf24' : 'var(--text-muted)'}}>{task.points}pts</span>
      </div>
    </div>
  </div>
));

export const Loading = () => (
  <div className="flex items-center justify-center" style={{height:200}}>
    <div className="loading-spinner" role="status" aria-label="Loading" />
  </div>
);

export const ErrorState = ({ msg, onRetry }) => (
  <div className="card flex-col items-center" style={{textAlign:'center',padding:'2rem',display:'flex',gap:12}}>
    <Icon name="alert" size={32} color="var(--accent-red)" />
    <p className="text-secondary">{msg}</p>
    {onRetry && <button className="btn-secondary btn-sm" onClick={onRetry}>Try again</button>}
  </div>
);

export const EmptyState = ({ msg, icon='book' }) => (
  <div style={{textAlign:'center',padding:'2.5rem',color:'var(--text-muted)'}}>
    <Icon name={icon} size={40} color="var(--border-light)" />
    <p className="mt-3 text-secondary">{msg}</p>
  </div>
);

export const FilterPanel = memo(({ filter, setFilter, modules }) => (
  <div className="flex items-center gap-3 mb-4 flex-wrap">
    <Icon name="filter" size={14} color="var(--text-muted)" />
    <select value={filter.module} onChange={e => setFilter(f=>({...f,module:e.target.value}))} style={{width:'auto',padding:'7px 12px',fontSize:13}} aria-label="Filter by module">
      <option value="">All Modules</option>
      {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
    </select>
    <select value={filter.status} onChange={e => setFilter(f=>({...f,status:e.target.value}))} style={{width:'auto',padding:'7px 12px',fontSize:13}} aria-label="Filter by status">
      <option value="">All Status</option>
      <option value="completed">Completed</option>
      <option value="pending">Pending</option>
    </select>
    {(filter.module || filter.status) && (
      <button className="btn-secondary btn-sm" onClick={() => setFilter({module:'',status:''})} style={{fontSize:12}}>Clear</button>
    )}
  </div>
));

export const ToastDisplay = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  if (!toast) return null;
  const isSuccess = toast.type === 'success';
  return (
    <div className="fade-in-up" onClick={onClose} style={{
      position:'fixed', bottom:'24px', right:'24px', zIndex:9999,
      background:'var(--bg-elevated)', border:`1px solid ${isSuccess ? 'rgba(0,230,184,0.3)' : 'var(--border)'}`,
      borderLeft:`4px solid ${isSuccess ? 'var(--accent-teal)' : 'var(--accent-blue)'}`,
      padding:'14px 20px', borderRadius:'var(--radius-lg)', boxShadow:'0 10px 40px rgba(0,0,0,0.4)',
      display:'flex', alignItems:'center', gap:'12px', cursor:'pointer',
      backdropFilter:'blur(16px)', color:'var(--text-primary)'
    }}>
      <Icon name={isSuccess ? "check" : "alert"} size={18} color={isSuccess ? "var(--accent-teal)" : "var(--accent-blue)"} />
      <span style={{fontSize:14, fontWeight:600}}>{toast.msg}</span>
    </div>
  );
};
