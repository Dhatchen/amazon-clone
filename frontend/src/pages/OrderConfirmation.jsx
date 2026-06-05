import { useParams, Link } from 'react-router-dom';

const OrderConfirmation = () => {
  const { id } = useParams(); // Grabs the generated order ID from the URL

  return (
    <div className="flex justify-center items-center py-16 px-4 min-h-[60vh]">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-200 max-w-2xl w-full text-center">
        
        {/* Animated Green Checkmark Circle */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        {/* The Final Success Message */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Order Placed Successfully!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Thank you for shopping with us. Your order has been received and is currently being processed for delivery.
        </p>
        
        {/* Order ID Display */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 inline-block shadow-inner w-full max-w-md">
          <p className="text-sm text-gray-500 mb-1">Your Order Reference ID:</p>
          <p className="font-mono font-bold text-lg text-gray-800 tracking-wide">{id}</p>
        </div>
        
        <div>
          <Link 
            to="/"
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-10 rounded-full transition-colors shadow-sm"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;