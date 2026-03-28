import React from 'react';
import { Icon } from './UI';

export const Sidebar = ({ user, view, setView, onLogout }) => {
  const studentLinks = [
    { id:'dashboard', label:'Dashboard', icon:'home' },
    { id:'modules', label:'My Modules', icon:'book' },
    { id:'tasks', label:'All Tasks', icon:'task' },
    { id:'progress', label:'Progress', icon:'chart' },
  ];
  const teacherLinks = [
  { id:'dashboard', label:'Overview', icon:'home' },
  { id:'students', label:'Students', icon:'users' }, // ✅ ADDED
  { id:'modules', label:'Modules', icon:'book' },
  { id:'tasks', label:'Manage Tasks', icon:'task' },
];
  const links = user.role === 'teacher' ? teacherLinks : studentLinks;
  return (
    <aside style={{width:220,background:'var(--bg-secondary)',borderRight:'1px solid var(--border)',padding:'1rem 0.75rem',display:'flex',flexDirection:'column',height:'100vh',position:'sticky',top:0,flexShrink:0}}>
      <div className="flex items-center gap-2 mb-6" style={{padding:'0 6px'}}>
        <div style={{width:32,height:32,borderRadius:8,background:'var(--accent-teal)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Icon name="chart" size={16} color="#0f1117" />
        </div>
        <span className="font-bold" style={{fontSize:16,color:'var(--text-primary)'}}>LPT</span>
      </div>
      <div className="mb-4" style={{padding:'10px',background:'var(--bg-elevated)',borderRadius:'var(--radius-lg)',border:'1px solid var(--border)'}}>
        <div className="flex items-center gap-2">
          <div className="avatar text-xs" style={{background: user.color+'22', color: user.color}}>{user.avatar}</div>
          <div>
            <p className="text-sm font-medium" style={{lineHeight:1.2}}>{user.name.split(' ')[0]}</p>
            <span className={`badge ${user.role==='teacher' ? 'badge-teal' : 'badge-blue'}`} style={{fontSize:10}}>{user.role}</span>
          </div>
        </div>
      </div>
      <nav aria-label="Main navigation" style={{flex:1,display:'flex',flexDirection:'column',gap:2}}>
        {links.map(l => (
          <button key={l.id} className={`sidebar-link ${view===l.id?'active':''}`} onClick={() => setView(l.id)} aria-current={view===l.id ? 'page' : undefined}>
            <Icon name={l.icon} size={16} color={view===l.id ? 'var(--accent-teal)' : 'var(--text-muted)'} />
            {l.label}
          </button>
        ))}
      </nav>
      <button className="sidebar-link" onClick={onLogout} aria-label="Sign out" style={{marginTop:'auto'}}>
        <Icon name="logout" size={16} color="var(--text-muted)" />
        Sign out
      </button>
    </aside>
  );
};
