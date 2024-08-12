import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) return
    await register({firstName, lastName, email, password});
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        <div className="mb-4">
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input 
            id="first_name"
            type="text" 
            placeholder="First Name" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input 
            id="last_name"
            type="text" 
            placeholder="Last Name" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input 
            id="email"
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input 
            id="password"
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
