import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react'; // Removed 'Search' since SearchBox handles it now
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import SearchBox from './SearchBox';

const Navbar = () => {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  
  // 1. Grab the auth state from Redux
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 2. Create the Logout function
  const handleLogout = () => {
    dispatch(logout()); // Wipes Redux and LocalStorage
    navigate('/'); // Sends them to the homepage
  };

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-md">
      {/* Top Row: Logo, Search, and Links */}
      <div className="flex items-center justify-between px-4 py-2 max-w-7xl mx-auto">
        
        {/* 1. Logo */}
        <Link to="/" className="flex items-center border border-transparent hover:border-white p-1 rounded">
          <span className="text-2xl font-bold tracking-tighter">
            amazon<span className="text-orange-500">clone</span>
          </span>
        </Link>

        {/* 2. Desktop Search Bar (Hidden on mobile) */}
        <div className="hidden sm:flex flex-grow mx-6 relative">
          <SearchBox />
        </div>

        {/* 3. Right Side Links */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Dynamic Auth Header */}
          {isAuthenticated ? (
            <div className="relative group cursor-pointer flex flex-col border border-transparent hover:border-white p-1 rounded">
              <span className="text-xs text-gray-300">Hello, {user?.name.split(' ')[0]}</span>
              <Link to="/profile" className="text-sm font-bold hover:underline">Account & Lists</Link>
              
              {/* Hidden Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1 w-48 bg-white text-gray-900 rounded shadow-lg hidden group-hover:block z-50 border border-gray-200">
                <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t">
                  <p className="font-bold text-sm">Hi, {user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600 font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="flex flex-col border border-transparent hover:border-white p-1 rounded">
              <span className="text-xs text-gray-300">Hello, sign in</span>
              <span className="text-sm font-bold leading-tight">Account & Lists</span>
            </Link>
          )}

          {/* Cart Icon */}
          <Link to="/cart" className="flex items-center border border-transparent hover:border-white p-1 rounded relative">
            <div className="relative flex items-center">
              <ShoppingCart size={34} />
              <span className="absolute top-0 left-4 text-orange-500 font-bold text-lg bg-gray-900 rounded-full px-1">
                {totalQuantity}
              </span>
            </div>
            <span className="hidden md:block text-sm font-bold mt-4 ml-1">Cart</span>
          </Link>
        </div>
      </div>

      {/* Bottom Row: Mobile Search Bar */}
      <div className="sm:hidden flex px-4 pb-3">
        <SearchBox />
      </div>
    </header>
  );
};

export default Navbar;