import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginUser } = useContext(AppContext);

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('app_users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      return setError("Invalid email or password.");
    }
    
    loginUser(foundUser);
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <p style={{color: 'var(--warning)', marginTop:'1rem'}}>{error}</p>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', marginTop:'1.5rem' }}>
          <div>
            <label className="mb-1 block">Email</label>
            <input required type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block">Password</label>
            <input required type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary w-full mt-4">Login</button>
        </form>
        <p className="mt-4"><Link to="/register" style={{color: 'var(--primary)'}}>Don't have an account? Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
