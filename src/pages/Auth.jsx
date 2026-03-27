import React, { useState } from 'react';
import { Icon } from '../components/UI';
import { mockApi, uid } from '../constants';

export const LoginForm = ({ users, onLogin, switchToRegister }) => {
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleLogin = async () => {
    setError('');
    if (!form.email || !form.password) { setError('Please fill all fields'); return; }
    setLoading(true);
    await mockApi(() => {
      const u = users.find(u => u.email === form.email && u.password === form.password);
      if (!u) throw new Error('Invalid credentials');
      return u;
    }).then(onLogin).catch(e => setError(e.message)).finally(() => setLoading(false));
  };
  const quickLogin = (email) => { setForm({ email, password:'demo' }); };
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:"url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop') center/cover no-repeat",position:'relative'}}>
      <div style={{position:'absolute',inset:0,background:'rgba(9, 9, 11, 0.75)',backdropFilter:'blur(8px)'}} />
      <div style={{width:'100%',maxWidth:400,padding:'0 1rem',position:'relative',zIndex:1}} className="fade-in">
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <div style={{width:52,height:52,borderRadius:12,background:'var(--accent-teal)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem',boxShadow:'0 8px 24px rgba(0,230,184,0.3)'}}>
            <Icon name="chart" size={24} color="#0f1117" />
          </div>
          <h1 className="text-xl font-bold">DLS</h1>
          <p className="text-secondary text-sm mt-1">Dashboard Learning System</p>
        </div>
        <div className="card" style={{padding:'1.5rem'}}>
          {error && <div className="mb-3 text-red text-sm" role="alert" style={{background:'#2a0f0f',padding:'8px 12px',borderRadius:'var(--radius)',border:'1px solid #5c2020'}}>{error}</div>}
          <div className="mb-4"><label htmlFor="login-email">Email</label><input id="login-email" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="Enter email" /></div>
          <div className="mb-4"><label htmlFor="login-password">Password</label><input id="login-password" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Enter password" onKeyDown={e=>e.key==='Enter'&&handleLogin()} /></div>
          <button className="btn-primary w-full" onClick={handleLogin} disabled={loading} aria-busy={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
          <p className="text-xs text-muted mt-5 text-center">Don't have an account? <button onClick={switchToRegister} style={{background:'none',border:'none',color:'var(--accent-teal)',cursor:'pointer',fontSize:12,padding:0}}>Register</button></p>
        </div>
      </div>
    </div>
  );
};

export const RegisterForm = ({ onRegister, switchToLogin }) => {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'student' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const avatarColors = { student:'#4f8ef7', teacher:'#00d4aa' };
  const handleRegister = async () => {
    setError('');
    if (!form.name || !form.email || !form.password) { setError('All fields required'); return; }
    if (form.password.length < 4) { setError('Password must be at least 4 characters'); return; }
    setLoading(true);
    await mockApi(() => {
      const nu = {
        id: uid(), name: form.name, email: form.email, password: form.password, role: form.role,
        avatar: form.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2),
        color: avatarColors[form.role]
      };
      return nu;
    }).then(onRegister).catch(e => setError(e.message)).finally(() => setLoading(false));
  };
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:"url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop') center/cover no-repeat",position:'relative'}}>
      <div style={{position:'absolute',inset:0,background:'rgba(9, 9, 11, 0.75)',backdropFilter:'blur(8px)'}} />
      <div style={{width:'100%',maxWidth:400,padding:'0 1rem',position:'relative',zIndex:1}} className="fade-in">
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <div style={{width:52,height:52,borderRadius:12,background:'var(--accent-purple)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem',boxShadow:'0 8px 24px rgba(192,132,252,0.3)'}}>
            <Icon name="users" size={24} color="#0f1117" />
          </div>
          <h1 className="text-xl font-bold">Create Account</h1>
          <p className="text-secondary text-sm mt-1">Join DLS today</p>
        </div>
        <div className="card" style={{padding:'1.5rem'}}>
          {error && <div className="mb-3 text-red text-sm" role="alert" style={{background:'#2a0f0f',padding:'8px 12px',borderRadius:'var(--radius)',border:'1px solid #5c2020'}}>{error}</div>}
          <div className="mb-3"><label htmlFor="reg-name">Full Name</label><input id="reg-name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Your name" /></div>
          <div className="mb-3"><label htmlFor="reg-email">Email</label><input id="reg-email" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="Email address" /></div>
          <div className="mb-3"><label htmlFor="reg-pass">Password</label><input id="reg-pass" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Min 4 characters" /></div>
          <div className="mb-4">
            <label>I am a</label>
            <div className="flex gap-2 mt-1">
              {['student','teacher'].map(r => (
                <button key={r} onClick={() => setForm(f=>({...f,role:r}))}
                  className={form.role===r ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
                  style={{flex:1}} aria-pressed={form.role===r}>
                  {r.charAt(0).toUpperCase()+r.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <button className="btn-primary w-full" onClick={handleRegister} disabled={loading} aria-busy={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
          <p className="text-xs text-muted mt-3 text-center">Already have an account? <button onClick={switchToLogin} style={{background:'none',border:'none',color:'var(--accent-teal)',cursor:'pointer',fontSize:12,padding:0}}>Sign in</button></p>
        </div>
      </div>
    </div>
  );
};
