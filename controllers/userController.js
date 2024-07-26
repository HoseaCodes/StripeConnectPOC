require('dotenv').config();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

const createStripeAccount = async (req, res) => {
  const user = await User.findById(req.body.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  try {
    const account = await stripe.accounts.create({
      type: 'express',
      email: user.email,
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
    });

    user.stripeAccountId = account.id;
    await user.save();

    // res.status(200).json({ accountId: account.id });
    // Return the account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.BASE_URL}/refresh?account_id=${account.id}`,
      return_url: `${process.env.BASE_URL}/return`,
      type: 'account_onboarding',
    });

    res.status(200).json({ url: accountLink.url });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const refreshAccountLink = async (req, res) => {
  const { account_id } = req.query;

  if (!account_id) {
    return res.status(400).json({ message: 'Account ID is required' });
  }

  try {
    const url = await createAccountLink(account_id);
    res.redirect(url);
  } catch (error) {
    console.error('Error refreshing account link:', error);
    res.status(500).json({ message: 'Unable to refresh account link. Please try again later.' });
  }
};

const getStripeAccount = async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  try {
    const account = await stripe.accounts.retrieve(user.stripeAccountId);
    res.status(200).json(account);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


module.exports = { registerUser, loginUser, createStripeAccount, getStripeAccount, getUserByEmail, refreshAccountLink };
