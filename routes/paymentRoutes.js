// routes/paymentRoutes.js
const express = require('express');
const { createPaymentIntent, transferFunds } = require('../controllers/paymentController');
const router = express.Router();

router.post('/create-payment-intent', createPaymentIntent);
router.post('/transfer-funds', transferFunds);

module.exports = router;
