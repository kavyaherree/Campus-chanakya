import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    setLoading(false);
  }, [token]);

  const login = (authData) => {
    setToken(authData.token);
    setUser({
      userId: authData.userId,
      email: authData.email,
      fullName: authData.fullName,
      role: authData.role,
      cgpa: authData.cgpa,
      branch: authData.branch,
    });
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify({
      userId: authData.userId,
      email: authData.email,
      fullName: authData.fullName,
      role: authData.role,
      cgpa: authData.cgpa,
      branch: authData.branch,
    }));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
