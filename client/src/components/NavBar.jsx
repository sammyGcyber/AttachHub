import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-badge">A</span> AttachHub
        </Link>
        <div className="nav-links">
          <Link to="/" className={isActive('/') ? 'active' : ''}>Explore Openings</Link>
          {user ? (
            <>
              {user.role === 'student' && (
                <Link to="/student-dashboard" className={isActive('/student-dashboard') ? 'active' : ''}>
                  My Applications
                </Link>
              )}
              {user.role === 'company' && (
                <Link to="/company-dashboard" className={isActive('/company-dashboard') ? 'active' : ''}>
                  Company Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin-dashboard" className={isActive('/admin-dashboard') ? 'active' : ''}>
                  Admin Portal
                </Link>
              )}
              <Link to="/profile" className={isActive('/profile') ? 'active' : ''}>Profile</Link>
              
              <div className="user-pill">
                <span>{user.email.split('@')[0]}</span>
                <span className="role-tag">{user.role}</span>
              </div>
              
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Log In</Link>
              <Link to="/register" className="btn-primary">Register Free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
