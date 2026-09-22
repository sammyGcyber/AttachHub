import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (emailToUse = email, passwordToUse = password) => {
    setError('');
    setLoading(true);
    try {
      const data = await loginUser({ email: emailToUse, password: passwordToUse });
      login(data, data.token);
      if (data.user.role === 'student') navigate('/student-dashboard');
      else if (data.user.role === 'company') navigate('/company-dashboard');
      else if (data.user.role === 'admin') navigate('/admin-dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    handleLoginSubmit(demoEmail, demoPass);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Log in to your AttachHub account to continue</p>
        
        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={(e) => { e.preventDefault(); handleLoginSubmit(); }}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@attachhub.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-search full-width" disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-logins">
          <p>⚡ 1-Click Demo Login (Instant Test)</p>
          <div className="demo-btn-group">
            <button
              type="button"
              className="btn-demo"
              onClick={() => fillDemoAccount('student@attachhub.com', 'password123')}
            >
              🎓 Student Demo
            </button>
            <button
              type="button"
              className="btn-demo"
              onClick={() => fillDemoAccount('safaricom@attachhub.com', 'password123')}
            >
              🏢 Company Demo
            </button>
            <button
              type="button"
              className="btn-demo"
              onClick={() => fillDemoAccount('admin@attachhub.com', 'password123')}
            >
              🛡️ Admin Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
