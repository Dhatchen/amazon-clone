import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // useDispatch is how we send actions to the Redux Brain
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevents the Link from triggering when clicking the button
    dispatch(addToCart(product));
  };

  return (
    <Link to={`/product/${product.id}`} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col hover:shadow-lg transition-shadow duration-200 group">
      {/* Real Image Area with a subtle zoom hover effect */}
      <div className="h-48 w-full mb-4 overflow-hidden rounded-md border border-gray-200">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Product Details */}
      <h3 className="font-bold text-lg text-gray-800 truncate group-hover:text-orange-600 transition-colors">{product.name}</h3>
      <p className="text-gray-500 text-xs mb-3 uppercase tracking-wider">{product.category}</p>
      
      {/* Price and Button */}
      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="font-extrabold text-xl text-gray-900">₹{product.price}</span>
        <button
          onClick={handleAddToCart}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-full font-semibold transition-colors text-sm shadow-sm relative z-10"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;