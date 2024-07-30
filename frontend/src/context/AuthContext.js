import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useCookies } from "react-cookie";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["accesstoken"]);
  const [accesstoken, setAccesstoken] = useState(null);


  const register = async (userData) => {
    const { data } = await api.post('/users/auth/register', userData);
    // localStorage.setItem('token', data.token);
    setUser(data);
  };

  const login = async (userData) => {
    try {
      const { data: loginData } = await api.post('/users/auth/login', userData);
      if (loginData) {
        setCookie('accesstoken', loginData.accesstoken);
        setAccesstoken(loginData.accesstoken)
        getUser(loginData.accesstoken)
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const getUser = async (token) => {
    try {
      const res = await api.get("/users/info", {
        headers: { Authorization: token },
      });
      setUser(res.data.user);
    } catch (error) {
      console.error('User Info Error:', error)
    }
  }

  const logout = async () => {
    // localStorage.removeItem('token');
    await api.post("/users/auth/logout", {}, {
      headers: { Authorization: accesstoken },
  });
    setUser(null);
    removeCookie("accesstoken");
    window.location.href = "/"
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, accesstoken, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
