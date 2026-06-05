import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { clearOrderSuccess } from '../store/orderSlice';

const ProductDetails = () => {
  const { id } = useParams(); // This is now a MongoDB string ID!
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Grab the live data array from the Redux Brain
  const { items: liveProducts } = useSelector((state) => state.products);

  // 2. Find the exact product (No more parseInt needed!)
  const product = liveProducts.find((p) => p.id === id);

  // 3. Fallback if they refresh the page directly on this URL
  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Loading product or Product not found</h2>
        <Link to="/" className="text-blue-600 hover:underline">Return to Home</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const buyNowHandler = () => {
  // 1. Reset any stale success state from previous orders
  dispatch(clearOrderSuccess());

  // 2. Add the item to the cart
  dispatch(
    addToCart({
      id: product._id,       
      name: product.name,
      image: product.image,  
      price: product.price,
      quantity: 1,           
    })
  );

  // 3. Immediately redirect to the checkout page
  navigate('/checkout');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:underline">Home</Link> &gt; {product.category} &gt; <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Column 1: High-Res Image */}
        <div className="w-full lg:w-1/3">
          <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Column 2: Product Info */}
        <div className="w-full lg:w-1/3 flex flex-col space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
            <span className="text-yellow-500 text-lg">★★★★☆</span>
            <span className="text-blue-600 hover:underline cursor-pointer">{product.averageRating || "4.0"} (124 ratings)</span>
          </div>

          <div className="pt-2">
            <span className="text-3xl font-medium text-gray-900">₹{product.price.toFixed(2)}</span>
            <p className="text-sm text-gray-500 mt-1">Free Returns</p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">About this item</h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>
        </div>

        {/* Column 3: The Buy Box */}
        <div className="w-full lg:w-1/4">
          <div className="border border-gray-300 rounded-lg p-5 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">₹{product.price.toFixed(2)}</h2>
            <p className="text-sm text-gray-500 mb-4">
              FREE delivery <span className="font-bold text-gray-900">Tomorrow</span>
            </p>
            
            <h3 className={`text-lg font-semibold mb-6 ${product.stock > 0 ? 'text-green-700' : 'text-red-600'}`}>
              {product.stock > 0 ? 'In Stock' : 'Currently Unavailable'}
            </h3>

            <div className="space-y-3">
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full font-semibold py-3 rounded-full shadow-sm transition-colors ${
                  product.stock > 0 ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Add to Cart
              </button>
              <button 
                onClick={buyNowHandler}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full transition-colors"
              >
                Buy Now
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-2">
              <div className="flex justify-between"><span>Ships from</span><span>AmazonClone</span></div>
              <div className="flex justify-between"><span>Sold by</span><span>AmazonClone</span></div>
              <div className="flex justify-between"><span>Returns</span><span className="text-blue-600">Eligible within 30 days</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;