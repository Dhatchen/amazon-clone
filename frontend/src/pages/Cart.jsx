import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { removeItem, increaseQuantity, decreaseQuantity } from '../store/cartSlice';
import { clearOrderSuccess } from '../store/orderSlice';

const Cart = () => {
  // 1. Read the cart items from the Redux Brain
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // 2. Calculate the total price dynamically
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
  // Anytime the user views their cart, ensure checkout success is reset
  dispatch(clearOrderSuccess());
  }, [dispatch]);

  // 3. Handle the "Empty Cart" scenario
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="flex justify-center mb-6 text-gray-300">
          <svg className="w-48 h-48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Your Amazon Cart is empty</h2>
        <Link to="/" className="text-blue-600 hover:text-orange-500 hover:underline">
          Shop today's deals
        </Link>
      </div>
    );
  }

  // 4. Render the populated Cart
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      
      {/* Left Side: Cart Items List */}
      <div className="flex-grow bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full">
        <h2 className="text-2xl font-bold mb-6 border-b pb-4">Shopping Cart</h2>
        
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-4 border-b pb-6 last:border-b-0 last:pb-0">
              {/* Cart Item Image */}
              <div className="w-full sm:w-32 h-32 rounded-md overflow-hidden border border-gray-200 shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="h-full w-full object-cover" 
                />
              </div>
              
              {/* Product Details */}
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                  <p className="text-green-600 text-sm font-semibold mt-1">In Stock</p>
                  <p className="text-sm text-gray-500 mt-1">Eligible for FREE Shipping</p>
                </div>
                
                {/* Interactive Quantity Controls */}
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
                    <button 
                      onClick={() => dispatch(decreaseQuantity(item.id))}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-lg font-bold rounded-l-md transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 font-semibold text-gray-800 bg-white">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => dispatch(increaseQuantity(item.id))}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-lg font-bold rounded-r-md transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-300">|</span>
                  <button 
                    onClick={() => dispatch(removeItem(item.id))}
                    className="text-sm text-red-500 hover:underline font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {/* Item Total Price */}
              <div className="text-right font-bold text-xl sm:w-24">
                ₹{item.totalPrice.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Order Summary / Checkout */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full lg:w-80 shrink-0 sticky top-24">
        <h3 className="text-lg font-bold mb-4">Order Summary</h3>
        <div className="flex justify-between mb-2 text-sm">
          <span>Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)}):</span>
          <span>₹{cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-4 text-sm border-b pb-4">
          <span>Shipping:</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="flex justify-between mb-6 text-xl font-bold text-red-700">
          <span>Order Total:</span>
          <span>₹{cartTotal.toFixed(2)}</span>
        </div>
        <button 
          onClick={() => navigate('/checkout')}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-full shadow-sm transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>

    </div>
  );
};

export default Cart;