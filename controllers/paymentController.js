require('dotenv').config();
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
    });

    res.status(200).json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error); // Log the error
    res.status(400).json({ message: error.message });
  }
};

const transferFunds = async (req, res) => {
  const { senderId, recipientId, amount, paymentIntentId } = req.body;

  try {
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!recipient.stripeAccountId) {
      return res.status(400).json({ message: 'Recipient Stripe account ID not found' });
    }

    const recipientAccount = await stripe.accounts.retrieve(recipient.stripeAccountId);
    
    if (!recipientAccount.capabilities.transfers) {
      try {
        await stripe.accounts.update(recipient.stripeAccountId,  {
          capabilities: {
            transfers: {
              requested: true,
            },
          },
        });
      } catch (error) {
        return res.status(400).json({ message: 'Recipient Stripe account capabilities updated. Please try again after the capabilities are enabled.' });
      }
    }

    const transfer = await stripe.transfers.create({
      amount,
      currency: 'usd',
      metadata: {
        paymentIntent: paymentIntentId,
      },
      destination: recipient.stripeAccountId,
    });

    res.status(200).json(transfer);
  } catch (error) {
    console.error('Error transferring funds:', error); // Log the error
    res.status(400).json({ message: error.message });
  }
};



module.exports = { createPaymentIntent, transferFunds };
