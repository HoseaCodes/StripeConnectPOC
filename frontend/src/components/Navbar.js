// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-white text-lg font-bold">
          Dashboard
        </Link>
        <div>
          {user ? (
            <button
              onClick={logout}
              className="bg-red-500 text-white py-2 px-4 rounded ml-4"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/register" className="text-white py-2 px-4 rounded ml-4">
                Register
              </Link>
              <Link to="/login" className="text-white py-2 px-4 rounded ml-4">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
