// // src/components/LinkBankAccount.js
// import React, { useState, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';

// const LinkBankAccount = () => {
//   const { user } = useContext(AuthContext);
//   const [accountNumber, setAccountNumber] = useState('');
//   const [routingNumber, setRoutingNumber] = useState('');
//   const [bankName, setBankName] = useState('');
//   const [message, setMessage] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };
//       const { data } = await axios.post(
//         '/bank/link',
//         { accountNumber, routingNumber, bankName },
//         config
//       );
//       setMessage(data.message);
//     } catch (error) {
//       setMessage(error.response.data.message || 'An error occurred');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
//       <h1 className="text-2xl mb-4">Link Bank Account</h1>
//       <input
//         type="text"
//         value={accountNumber}
//         onChange={(e) => setAccountNumber(e.target.value)}
//         placeholder="Account Number"
//         required
//         className="w-full mb-4 p-2 border border-gray-300"
//       />
//       <input
//         type="text"
//         value={routingNumber}
//         onChange={(e) => setRoutingNumber(e.target.value)}
//         placeholder="Routing Number"
//         required
//         className="w-full mb-4 p-2 border border-gray-300"
//       />
//       <input
//         type="text"
//         value={bankName}
//         onChange={(e) => setBankName(e.target.value)}
//         placeholder="Bank Name"
//         required
//         className="w-full mb-4 p-2 border border-gray-300"
//       />
//       <button type="submit" className="w-full bg-blue-500 text-white p-2">
//         Link Bank Account
//       </button>
//       {message && <p className="mt-4 text-center">{message}</p>}
//     </form>
//   );
// };

// export default LinkBankAccount;
// src/components/LinkBankAccount.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { usePlaidLink } from 'react-plaid-link';
import api from '../utils/api';

const LinkBankAccount = ({ token, user }) => {
  console.log(user)
  const { accesstoken } = useContext(AuthContext);

  const onSuccess = async (public_token, metadata) => {
    try {
      const { data } = await api.post(
        '/bank/link',
        { public_token, accounts: metadata.accounts, user },
        {
          headers: { Authorization: accesstoken },
        },
      );
      alert(data.message);
    } catch (error) {
      console.error(error);
      alert('An error occurred while linking the bank account.');
    }
  };

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
  });

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">Link Bank Account</h1>
      <button
        onClick={() => open()}
        disabled={!ready}
        className="w-full bg-blue-500 text-white p-2"
      >
        Link Bank Account
      </button>
    </div>
  );
};

export default LinkBankAccount;
