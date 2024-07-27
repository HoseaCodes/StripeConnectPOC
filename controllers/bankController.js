// controllers/bankController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const plaidClient = require('../lib/plaidClient');

const linkBankAccount = async (req, res) => {
  console.log(req.body)
  const { accountNumber, routingNumber, bankName, accounts, user, public_token } = req.body;
  
  const currentUser = await User.findById(user._id);

  if (!currentUser) {
    res.status(404).json({ message: 'User not found' });
  }
  try {
    const response = await plaidClient.itemPublicTokenExchange({public_token: public_token});
    const accessToken = response.access_token;
    const itemId = response.item_id;

    const bankAccounts = accounts.map(account => ({
    accountId: account.id,
    accountName: account.name,
    accountMask: account.mask,
    accountType: account.type,
    accountSubtype: account.subtype,
    institutionName: "",
    accessToken,
    itemId,
    accountNumber: account.number || "", 
    routingNumber: account.routing || "", 
    bankName: account.name || ""
    }));

    currentUser.bankAccounts = currentUser.bankAccounts.concat(bankAccounts);
    await currentUser.save();

    res.status(201).json({ message: 'Bank account linked successfully.' });
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message });
  }
};

module.exports = { linkBankAccount };
