import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { saveShippingAddress, savePaymentMethod, clearCart, clearShippingAddress } from '../store/cartSlice';
import { createOrder, clearOrderSuccess } from '../store/orderSlice';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Pull data from the Redux Brain
  const { items, shippingAddress, paymentMethod } = useSelector((state) => state.cart);
  const { user, token } = useSelector((state) => state.auth);
  const { loading, success, error, order: placedOrder } = useSelector((state) => state.order);

  // 2. Setup Local State for the Form
  const [fullName, setFullName] = useState(shippingAddress.fullName || user?.name || '');
  const [mobileNo, setMobileNo] = useState(shippingAddress.mobileNo || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [stateName, setStateName] = useState(shippingAddress.stateName || '');
  const [country, setCountry] = useState(shippingAddress.country || 'India');
  const [payment, setPayment] = useState(paymentMethod);

  // 3. Auto-fill City & State when PIN code is 6 digits
  useEffect(() => {
    const fetchPinCodeDetails = async () => {
      if (postalCode.length === 6) {
        try {
          const response = await axios.get(`https://api.postalpincode.in/pincode/${postalCode}`);
          const data = response.data[0];
          
          if (data.Status === 'Success') {
            const postOffice = data.PostOffice[0];
            setCity(postOffice.District);
            setStateName(postOffice.State);
          }
        } catch (error) {
          console.error('Error fetching PIN details:', error);
        }
      }
    };

    const timeoutId = setTimeout(() => fetchPinCodeDetails(), 500);
    return () => clearTimeout(timeoutId);
  }, [postalCode]);

  // 4. Handle Order Success & Routing (This is where the fix is!)
  useEffect(() => {
    if (success && placedOrder) {
      // 1. Clear the cart so it's empty for the next shopping trip
      dispatch(clearCart());
      dispatch(clearShippingAddress());
      
      if (placedOrder.paymentMethod === 'Cash On Delivery') {
        dispatch(clearOrderSuccess());
        navigate(`/order-confirmation/${placedOrder._id}`);
      } else {
        // Redirection flow for Credit Card / UPI online payments
        const redirectToStripe = async () => {
          try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.post(
              'http://localhost:5000/api/v1/orders/stripe-checkout', 
              { orderId: placedOrder._id }, 
              config
            );
            if (response.data.url) {
              dispatch(clearOrderSuccess());
              window.location.href = response.data.url; 
            } else {
              // Fallback to order page if URL is missing
              dispatch(clearOrderSuccess());
              navigate(`/order/${placedOrder._id}`);
            }
          } catch (err) {
            console.error("Failed to redirect to Stripe:", err);
            // Fallback to order page on error so they can manually try again
            dispatch(clearOrderSuccess());
            navigate(`/order/${placedOrder._id}`);
          }
        };
        redirectToStripe();
      }
    }
  }, [success, navigate, dispatch, placedOrder, token]);

  // 5. Check for empty cart ON INITIAL LOAD ONLY
  useEffect(() => {
     if (items.length === 0 && !success) {
       navigate('/cart');
     }
  }, [items.length, success, navigate]);

  // 6. Calculate Totals (in Rupees)
  const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 500 ? 0 : 40;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // 7. Handle Form Submission
  const submitHandler = (e) => {
    e.preventDefault();
    
    dispatch(saveShippingAddress({ fullName, mobileNo, address, postalCode, city, stateName, country }));
    dispatch(savePaymentMethod(payment));

    const formattedOrderItems = items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      image: item.image,
      price: item.price,
      product: item.id,
    }));

    const orderData = {
      orderItems: formattedOrderItems,
      shippingAddress: { fullName, mobileNo, address, postalCode, city, stateName, country },
      paymentMethod: payment,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    };
    
    dispatch(createOrder(orderData));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start relative">
      
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
        </div>
      )}

      {/* Left Column: Forms */}
      <div className="flex-grow w-full space-y-6">
        <form onSubmit={submitHandler} id="checkout-form">
          
          {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">{error}</div>}

          {/* 1. Shipping Address Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">1. Delivery Address</h2>
            
            <div className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    placeholder="Recipient's Name" 
                    className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1">Mobile Number</label>
                  <input type="tel" required value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} placeholder="10-digit mobile number" className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Street Address</label>
                <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House number, Building, Street, Area" className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">PIN Code</label>
                <input type="text" required maxLength="6" value={postalCode} onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))} placeholder="6-digit PIN code" className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" />
                <p className="text-xs text-gray-500 mt-1">City and State will auto-fill based on PIN</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1">City / District</label>
                  <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1">State</label>
                  <input type="text" required value={stateName} onChange={(e) => setStateName(e.target.value)} className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Country</label>
                <input type="text" required value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>
          </div>

          {/* 2. Payment Method Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">2. Payment Method</h2>
            
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="radio" name="paymentMethod" value="Credit Card" checked={payment === 'Credit Card'} onChange={(e) => setPayment(e.target.value)} className="h-4 w-4 text-orange-500 focus:ring-orange-500" />
                <span className="ml-3 font-medium text-gray-900">Credit or Debit Card</span>
              </label>
              
              <label className="flex items-center p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="radio" name="paymentMethod" value="UPI" checked={payment === 'UPI'} onChange={(e) => setPayment(e.target.value)} className="h-4 w-4 text-orange-500 focus:ring-orange-500" />
                <span className="ml-3 font-medium text-gray-900">UPI (GPay, PhonePe, Paytm)</span>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="radio" name="paymentMethod" value="Cash On Delivery" checked={payment === 'Cash On Delivery'} onChange={(e) => setPayment(e.target.value)} className="h-4 w-4 text-orange-500 focus:ring-orange-500" />
                <span className="ml-3 font-medium text-gray-900">Cash on Delivery (COD)</span>
              </label>
            </div>
          </div>

        </form>
      </div>

      {/* Right Column: Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full lg:w-96 shrink-0 sticky top-24">
        <button 
          type="submit" 
          form="checkout-form"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-full shadow-sm transition-colors mb-4"
        >
          Place your order
        </button>
        
        <p className="text-xs text-gray-500 text-center mb-6 border-b pb-4">
          By placing your order, you agree to Amazon Clone's privacy notice and conditions of use.
        </p>

        <h3 className="text-lg font-bold mb-4 text-gray-900">Order Summary</h3>
        
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Items:</span>
            <span>₹{itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery:</span>
            <span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Total before tax:</span>
            <span>₹{(itemsPrice + shippingPrice).toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span>Estimated tax:</span>
            <span>₹{taxPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 text-xl font-bold text-red-700">
            <span>Order Total:</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Checkout;