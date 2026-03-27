import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Register = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [section, setSection] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { loginUser } = useContext(AppContext);

  const handleRegister = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('app_users') || '[]');
    
    if (users.some(u => u.email === email)) {
      return setError("Email already in use.");
    }

    const newUser = { id: Date.now().toString(), role, email, password };
    if (role === 'teacher') newUser.teacherId = teacherId;
    if (role === 'student') newUser.section = section;
    
    users.push(newUser);
    localStorage.setItem('app_users', JSON.stringify(users));
    
    loginUser(newUser);
    navigate(`/${role}-dashboard`);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        {error && <p style={{color: 'var(--warning)', marginTop:'1rem'}}>{error}</p>}
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', marginTop:'1.5rem' }}>
          <div>
            <label className="mb-1 block">Role</label>
            <select className="form-input" value={role} onChange={e => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block">Email</label>
            <input required type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block">Password</label>
            <input required type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {role === 'teacher' ? (
            <div>
              <label className="mb-1 block">Teacher ID</label>
              <input required type="text" placeholder="e.g. T123" className="form-input" value={teacherId} onChange={e => setTeacherId(e.target.value)} />
            </div>
          ) : (
            <div>
              <label className="mb-1 block">Section</label>
              <input required type="text" placeholder="e.g. section7" className="form-input" value={section} onChange={e => setSection(e.target.value)} />
            </div>
          )}
          <button type="submit" className="btn-primary w-full mt-4">Register</button>
        </form>
        <p className="mt-4"><Link to="/login" style={{color: 'var(--primary)'}}>Already have an account? Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
