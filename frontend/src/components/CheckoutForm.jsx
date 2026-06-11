import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../store/orderSlice';

const CheckoutForm = ({ orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  
  const { token } = useSelector((state) => state.auth);
  
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // 1. Fetch the secret permission slip on load
  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.post('http://localhost:5000/api/v1/orders/stripe-payment-intent', { orderId }, config);
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Stripe Error:", err);
      }
    };
    fetchClientSecret();
  }, [orderId, token]);

  // 2. Handle the Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      // 3. Payment Success! Tell your Node backend to mark the order as paid
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.put(`http://localhost:5000/api/v1/orders/${orderId}/pay`, {}, config);
        
        setError(null);
        setProcessing(false);
        // Refresh the page so the user sees the green "Paid" badge!
        dispatch(getOrderDetails(orderId)); 
      } catch (err) {
        console.error("Payment Confirmation Error:", err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 border border-gray-300 rounded p-4 bg-gray-50">
      <CardElement options={{ style: { base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } } } }} />
      {error && <div className="text-red-500 text-sm mt-3 font-semibold">{error}</div>}
      <button 
        disabled={processing || !stripe || !clientSecret} 
        className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded shadow-sm disabled:opacity-50 transition-colors"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default CheckoutForm;