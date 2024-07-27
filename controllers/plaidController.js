// controllers/plaidController.js
const plaidClient = require('../lib/plaidClient');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const createLinkToken = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const configs = {
    user: {
      client_user_id: user._id.toString(),
    },
    client_name: 'StripePOC',
    products: ['auth'],
    country_codes: ['US'],
    language: 'en',
  };

  try {
    const result = await plaidClient.linkTokenCreate(configs);
    res.status(200).json(result.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const exchangePublicToken = async (req, res) => {
    const { public_token } = req.body;
    const user = await User.findById(req.user.id);
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    try {
      const response = await plaidClient.itemPublicTokenExchange(public_token);
      const { access_token, item_id } = response;
  
      user.plaidAccessToken = access_token;
      user.plaidItemId = item_id;
      await user.save();
  
      res.status(200).json({ message: 'Token exchanged successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

module.exports = { createLinkToken, exchangePublicToken };
