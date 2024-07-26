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
          console.log({paymentIntent})
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
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={handleOnboarding}>Onboard with Stripe</button>
      <form onSubmit={handlePayment}>
        <CardElement />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <input
          type="email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          placeholder="Recipient Email"
          required
        />
        <button type="submit" disabled={!stripe}>Pay</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default Dashboard;
