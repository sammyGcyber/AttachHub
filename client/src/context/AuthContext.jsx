import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('attachhub_token');
    if (token) {
      getCurrentUser()
        .then((data) => {
          setUser(data.user);
          setProfile(data.profile);
        })
        .catch(() => {
          localStorage.removeItem('attachhub_token');
          setUser(null);
          setProfile(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('attachhub_token', token);
    setUser(userData.user);
    setProfile(userData.profile);
  };

  const logout = () => {
    localStorage.removeItem('attachhub_token');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
