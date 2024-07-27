// routes/paymentRoutes.js
const express = require('express');
const { createPaymentIntent, transferFunds } = require('../controllers/paymentController');
const { auth } = require('../utils/auth')
const router = express.Router();

router.post('/create-payment-intent', auth, createPaymentIntent);
router.post('/transfer-funds', auth, transferFunds);

module.exports = router;
