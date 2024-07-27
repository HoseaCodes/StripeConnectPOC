import React, { useState } from 'react';


const SelectBankAccount = ({ bankAccounts }) => {
  const [selectedAccount, setSelectedAccount] = useState('');

  const handleChange = (event) => {
    setSelectedAccount(event.target.value);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700">
        Select Bank Account For Payment
      </label>
      <select
        id="bankAccount"
        value={selectedAccount}
        onChange={handleChange}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="">Select an account</option>
        {bankAccounts.map((account) => (
          <option key={account.accountId} value={account.accountId}>
            {account.accountName} - {account.accountMask}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectBankAccount;
