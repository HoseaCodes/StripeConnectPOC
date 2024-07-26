// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
