import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const register = async (userData) => {
    const { data } = await api.post('/users/register', userData);
    localStorage.setItem('token', data.token);
    setUser(data);
  };

  const login = async (userData) => {
    const { data } = await api.post('/users/login', userData);
    localStorage.setItem('token', data.token);
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
