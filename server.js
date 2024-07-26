require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cors = require("cors");

const app = express();

app.use(
    cors({
        origin: "*",
    })
  );
app.use(bodyParser.json());
console.log(process.env.MONGO_URI)

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

app.listen(3001, () => console.log('Server running on port 3001'));
