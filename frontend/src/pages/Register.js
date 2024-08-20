import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [ssn, setSsn] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !dob || !line1|| !city || !postalCode || !state || !country || !phone || !email || !password || !ssn) return
    await register({firstName, lastName, dob, line1, city, postalCode, state, country, phone, email, password, ssn});
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
          <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input 
            id="date_of_birth"
            type="date" 
            placeholder="mm/dd/yyyy" 
            value={dob} 
            onChange={(e) => setDob(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="line1" className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input 
            id="line1"
            type="text" 
            placeholder="Street" 
            value={line1} 
            onChange={(e) => setLine1(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input 
            id="city"
            type="text" 
            placeholder="City" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
            State/Province
          </label>
          <input 
            id="state"
            type="text" 
            placeholder="State/Province" 
            value={state} 
            onChange={(e) => setState(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700 mb-2">
            Postal Code
          </label>
          <input 
            id="postal-code"
            type="text" 
            placeholder="Postal Code" 
            value={postalCode} 
            onChange={(e) => setPostalCode(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <select 
            id="country" 
            value={country} 
            onChange={(e) => setCountry(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input 
            id="phone"
            type="text" 
            placeholder="Phone Number" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="ssn" className="block text-sm font-medium text-gray-700 mb-2">
            SSN
          </label>
          <input 
            id="ssn"
            type="text" 
            placeholder="xxx-xx-xxxx" 
            value={ssn} 
            onChange={(e) => setSsn(e.target.value)} 
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
