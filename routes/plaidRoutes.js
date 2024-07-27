// routes/plaidRoutes.js
const express = require('express');
const { createLinkToken, exchangePublicToken } = require('../controllers/plaidController');
const { auth } = require('../utils/auth');
const router = express.Router();

router.post('/create_link_token', auth, createLinkToken);
router.post('/exchange_public_token', auth, exchangePublicToken);

module.exports = router;
