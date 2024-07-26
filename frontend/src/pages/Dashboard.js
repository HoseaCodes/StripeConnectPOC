import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../utils/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');

//   useEffect(() => {
//     const createStripeAccount = async () => {
//       console.log({user})
//       if (!user.stripeAccountId) {
//         try {
//             await api.post('/users/stripe-account', { userId: user._id });
//         } catch (error) {
//             console.log(error)
//         }
//       }
//     };

//     createStripeAccount();
//   }, [user]);

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      const recipient = await api.get(`/users/email/${recipientEmail}`);
      if (!recipient.data) {
        setStatus('Recipient not found');
        return;
      }

      const paymentIntentResponse = await api.post('/payments/create-payment-intent', {
        amount: amount * 100, 
        currency: 'usd',
      });

      console.log('Payment Intent Response:', paymentIntentResponse.data); // Log the response
      const clientSecret = paymentIntentResponse.data.client_secret;

      if (!clientSecret) {
        setStatus('Payment Intent creation failed');
        return;
      }

      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: user.name },
        },
      });

      if (error) {
        setStatus(error.message);
      } else {
        console.log({paymentIntent});
        setStatus(`Payment ${paymentIntent.status}`);
        await api.post('/payments/transfer-funds', {
          senderId: user._id,
          recipientId: recipient.data._id,
          amount: amount * 100,
          paymentIntentId: paymentIntent.id, // Pass the paymentIntent ID to the server
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus(error.message);
    }
  };

  const handleOnboarding = async () => {
    try {
      const response = await api.post('/users/stripe-account', { userId: user._id });
      const { url } = response.data;

      // Redirect the user to the Stripe onboarding URL
      window.location.href = url;
    } catch (error) {
      console.error('Error starting onboarding:', error);
      setStatus(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
      <button
        className="w-full py-2 mb-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={handleOnboarding}
      >
        Onboard with Stripe
      </button>
      <form onSubmit={handlePayment} className="space-y-4">
        <div className="bg-gray-100 p-2 rounded-md">
          <CardElement />
        </div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          placeholder="Recipient Email"
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          disabled={!stripe}
          className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Pay
        </button>
      </form>
      {status && <p className="mt-4 text-red-500">{status}</p>}
    </div>
  );
};

export default Dashboard;
