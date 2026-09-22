import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [extraField, setExtraField] = useState(''); // institution or industry
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const profileData = role === 'student' 
      ? { fullName: name, institution: extraField, course: 'Diploma in IT', yearOfStudy: 'Year 2' }
      : { companyName: name, industry: extraField, location: 'Nairobi' };

    try {
      const data = await registerUser({ email, password, role, profileData });
      login(data, data.token);
      navigate(role === 'student' ? '/student-dashboard' : '/company-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Register for AttachHub</h2>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Account Type</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="company">Company / Employer</option>
            </select>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
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
          <div className="form-group">
            <label>{role === 'student' ? 'Full Name' : 'Company Name'}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>{role === 'student' ? 'Institution / University' : 'Industry Sector'}</label>
            <input
              type="text"
              required
              value={extraField}
              onChange={(e) => setExtraField(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary full-width">Create Account</button>
        </form>
      </div>
    </div>
  );
}
