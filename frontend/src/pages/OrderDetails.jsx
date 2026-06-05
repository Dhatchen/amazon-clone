import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { getOrderDetails, cancelOrderAction, resetCancelState } from '../store/orderSlice';

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get('payment');

  const { token } = useSelector((state) => state.auth);
  const { orderDetails: order, loadingDetails, error, successCancel, loadingCancel } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  // Mark order as paid if Stripe payment is successful
  useEffect(() => {
    if (paymentStatus === 'success' && order && !order.isPaid) {
      const payOrder = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          await axios.put(`http://localhost:5000/api/v1/orders/${id}/pay`, {}, config);
          // Reload the updated details
          dispatch(getOrderDetails(id));
        } catch (err) {
          console.error("Error marking order as paid:", err);
        }
      };
      payOrder();
    }
  }, [paymentStatus, order, id, token, dispatch]);

  useEffect(() => {
    if (successCancel) {
      dispatch(getOrderDetails(id));
      dispatch(resetCancelState());
    }
  }, [successCancel, dispatch, id]);

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      dispatch(cancelOrderAction(id));
    }
  };

  // CRITICAL FIX: This is the function that was missing!
  const handleStripePayment = async () => {
    try {
      console.log("1. Button clicked! Requesting Stripe URL for Order:", id);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.post(
        'http://localhost:5000/api/v1/orders/stripe-checkout', 
        { orderId: id }, 
        config
      );
      
      console.log("2. Backend response received:", response.data);
      
      if (response.data.url) {
        console.log("3. Success! Redirecting your browser to Stripe...");
        window.location.href = response.data.url; 
      } else {
        console.error("Error: Backend responded, but the URL is missing!");
      }
    } catch (err) {
      console.error("4. ERROR:", err.response ? err.response.data : err.message);
      alert(`Payment failed to initialize. Check console for details.`);
    }
  };

  if (loadingDetails) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return <div className="text-center py-20 text-red-500 text-xl font-bold">{error || "Order not found"}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Details</h1>

      {paymentStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <span className="font-bold">Payment Successful!</span> Thank you for your payment. Your order has been updated.
          </div>
        </div>
      )}

      {paymentStatus === 'cancelled' && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <span className="font-bold">Payment Cancelled.</span> The Stripe session was cancelled. You can try paying again using the button below.
          </div>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column */}
        <div className="flex-grow w-full space-y-6">
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Shipping Information</h2>
            <p className="mb-2"><span className="font-semibold">Name: </span> {order.shippingAddress?.fullName || order.user.name}</p>
            <p className="mb-2"><span className="font-semibold">Email: </span> {order.user.email}</p>
            <p className="mb-4">
              <span className="font-semibold">Address: </span>
              {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.stateName} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            <div className={`inline-block px-4 py-2 rounded font-bold text-sm ${
              order.isCancelled ? 'bg-red-100 text-red-800' : 
              order.isDelivered ? 'bg-green-100 text-green-800' : 
              'bg-orange-100 text-orange-800'
            }`}>
              {order.isCancelled 
                ? 'Cancelled' 
                : order.isDelivered 
                  ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` 
                  : 'Processing / Not Delivered Yet'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Payment Method</h2>
            <p className="mb-4"><span className="font-semibold">Method: </span> {order.paymentMethod}</p>
            
            {!order.isPaid && !order.isCancelled ? (
              <button 
                onClick={handleStripePayment}
                className="mt-3 w-full max-w-xs bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-md shadow-sm transition-colors border border-yellow-500"
              >
                Proceed to Secure Payment
              </button>
            ) : (
              <div className={`inline-block px-4 py-2 rounded font-bold text-sm ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 border-b pb-4 last:border-0">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded border" />
                  <div className="flex-grow">
                    <Link to={`/product/${item.product}`} className="text-blue-600 hover:underline font-medium">{item.name}</Link>
                  </div>
                  <div className="font-semibold text-gray-800">
                    {item.quantity} x ₹{item.price.toFixed(2)} = ₹{(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Summary */}
        <div className="w-full lg:w-1/3 shrink-0">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Order Summary</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between"><span>Items:</span><span>₹{order.itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping:</span><span>₹{order.shippingPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax:</span><span>₹{order.taxPrice.toFixed(2)}</span></div>
              <div className="flex justify-between pt-3 border-t text-lg font-bold text-gray-900">
                <span>Total:</span><span>₹{order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {order.isCancelled ? (
              <div className="mt-6 bg-red-50 text-red-700 text-center py-3 px-4 rounded border border-red-200 font-medium">
                Order Cancelled on {new Date(order.cancelledAt).toLocaleDateString()}
              </div>
            ) : !order.isDelivered && (
              <button 
                onClick={handleCancel}
                disabled={loadingCancel}
                className="w-full mt-6 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-4 rounded border border-red-200 shadow-sm transition-colors disabled:opacity-50"
              >
                {loadingCancel ? 'Processing...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default OrderDetails;