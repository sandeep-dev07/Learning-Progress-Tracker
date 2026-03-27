import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">LMS Dash</div>
      <div className="nav-links">
        {!user ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link btn-primary">Register</Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <span className="welcome-text font-semibold">User: {user.email || 'Author'}</span>
            <button onClick={handleLogout} className="btn-secondary small p-2">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
