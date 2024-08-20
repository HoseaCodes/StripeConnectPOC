require('dotenv').config();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
  const { firstName, lastName, line1, city, state, postalCode, country, email, password, phone, dob, ssn } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    const user = await User.create({ firstName, lastName, email, password, phone, ssn, address: {line1, city, state, postal_code: postalCode, country}, dob: { day: new Date(dob).getDate(), month: new Date(dob).getMonth() + 1, year: new Date(dob).getFullYear()}, });
    //Create jsonwebtoken for authentication
    const accesstoken = createAccessToken({ id: user._id });
    const refreshtoken = createRefreshToken({ id: user._id });

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      path: "/api/v1/user/refresh_token",
      maxAge: 7 * 25 * 60 * 60 * 1000,
    });

    res.json({ accesstoken });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: `Invalid user data: ${error.message}` });
  }
};

function refreshToken(req, res) {
  try {
    let rf_token = req.cookies.refreshtoken;
    if (rf_token)
      rf_token = rf_token = req.cookies.refreshtoken.replace(/^JWT\s/, "");
    if (!rf_token)
      return res.status(400).json({ msg: "Please Login or Register" });

    jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err)
        return res
          .status(400)
          .json({ msg: "Please Verify Info & Login or Register" });

      const accesstoken = createAccessToken({ id: user.id });

      res.json({ accesstoken });
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message, err: err });
  }
}

const loginUser = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const accesstoken = createAccessToken({ id: user._id });
    const refreshtoken = createRefreshToken({ id: user._id });

    if (rememberMe) {
      // Only set cookies if user checks remember me
      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/api/v1/user/refresh_token",
        maxAge: 7 * 25 * 60 * 60 * 1000,
      });
    }
    res.cookie("accesstoken", accesstoken, {
      maxAge: 7 * 25 * 60 * 60 * 1000,
      path: "/api/v1/user/login",
      httpOnly: true,
    });

    res.json({ accesstoken });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

async function logout(req, res) {
  try {
    res.clearCookie("refreshtoken", { path: "/api/v1/users/refresh_token" });
    return res.json({ msg: "Logged Out" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

async function getUser(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    res.cookie("user-cache", user.id + "user", {
      maxAge: 1000 * 60 * 60, // would expire after an hour
      httpOnly: true, // The cookie only accessible by the web server
    });

    res.json({
      status: "success",
      user: user,
      result: user.length,
      location: "main",
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ msg: err.message });
  }
}

const createStripeAccount = async (req, res) => {
  const user = await User.findById(req.body.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  try {
    const account = await stripe.accounts.create({
      type: 'custom',
      email: user.email,
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },

      },

      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: req.ip,
      },

      business_type: "individual",

      individual: {
        first_name: user.firstName,
        last_name: user.lastName,
        dob: {
          day: user.dob.day,
          month: user.dob.month,
          year: user.dob.year,
        },
        address: {
          line1: user.address.line1,
          city: user.address.city,
          state: user.address.state,
          postal_code: user.address.postal_code,
          country: user.address.country,
        },
        email: user.email,
        phone: user.phone,
        id_number: user.ssn, //222222222 for testing 
      },
      business_profile: {
        mcc: '5734',
        url: 'https://github.com/HoseaCodes',
      },
      external_account: {
        object: 'bank_account',
        country: 'US',
        currency: 'usd',
        // routing_number: user.bankAccounts[0]?.routingNumber,
        // account_number: user.bankAccounts[0]?.accountNumber,
        routing_number: '110000000',
        account_number: '000123456789',
        account_holder_name: `${user.firstName} ${user.lastName}`,
        account_holder_type: 'individual',
      },
    });
     // Check if any verification is still required
     console.log(account.requirements.currently_due)
     if (account.requirements.currently_due.length > 0) {
      return res.status(400).json({ message: 'Additional verification is required', requirements: account.requirements.currently_due });
    }
    user.stripeAccountId = account.id;
    //
    user.onboarded = true;
    await user.save();

    // res.status(200).json({ accountId: account.id });
    // Return the account link for onboarding

    res.status(200).json({ message: 'Account verified and onboarded successfully'});
    // const accountLink = await stripe.accountLinks.create({
    //   account: account.id,
    //   refresh_url: `${process.env.BASE_URL}/refresh?account_id=${account.id}`,
    //   return_url: `${process.env.BASE_URL}/return`,
    //   type: 'account_onboarding',
    // });

    // res.status(200).json({ url: accountLink.url });
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


module.exports = {
  registerUser,
  loginUser,
  createStripeAccount,
  getStripeAccount,
  getUserByEmail,
  refreshAccountLink,
  refreshToken,
  logout,
  getUser
};
