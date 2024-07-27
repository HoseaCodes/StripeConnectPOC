// routes/bankRoutes.js
const express = require('express');
const { linkBankAccount } = require('../controllers/bankController');
const router = express.Router();

router.post('/link', linkBankAccount);

module.exports = router;
