require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const bankRoutes = require('./routes/bankRoutes');
const plaidRoutes = require('./routes/plaidRoutes');
const cors = require("cors");
const logger = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();

app.use(
    cors({
        origin: "*",
    })
);
app.use(logger("dev"));
app.use(mongoSanitize());
app.use(bodyParser.json());
console.log(process.env.MONGO_URI)

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/bank', bankRoutes);
app.use('/api/v1/plaid', plaidRoutes);

app.listen(3001, () => console.log('Server running on port 3001'));
