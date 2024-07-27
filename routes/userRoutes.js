// routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser, createStripeAccount, logout, refreshToken,
    getStripeAccount, getUserByEmail, refreshAccountLink, getUser } = require('../controllers/userController');
const {auth} = require('../utils/auth');
const router = express.Router();

router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/logout', logout);
router.post('/stripe-account', auth,createStripeAccount);
router.get('/stripe-account/:userId', auth, getStripeAccount);
router.get('/email/:email', auth, getUserByEmail);
router.get('/refresh', auth, refreshAccountLink);
router.get('/refresh_token', auth, refreshToken);
router.get('/info', auth, getUser);

module.exports = router;
