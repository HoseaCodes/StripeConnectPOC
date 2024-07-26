// routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser, createStripeAccount, getStripeAccount, getUserByEmail, refreshAccountLink } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/stripe-account', createStripeAccount);
router.get('/stripe-account/:userId', getStripeAccount);
router.get('/email/:email', getUserByEmail);
router.get('/refresh', refreshAccountLink);

module.exports = router;
