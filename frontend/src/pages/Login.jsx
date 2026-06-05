import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginSuccess } from '../store/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setError(''); // Clear old errors

    try {
      // 1. Send the POST request to your local Node server
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
        email,
        password
      });

      // 2. Send the token and user data to the Redux Brain
      dispatch(loginSuccess({
        token: response.data.token,
        user: response.data.user
      }));

      // 3. Redirect the user back to the Home page
      navigate('/');
      
    } catch (err) {
      // If the backend sends an error (like wrong password), display it
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
        
        {/* Amazon-style Logo Header */}
        <div className="text-center mb-6">
          <span className="text-3xl font-bold tracking-tighter">
            amazon<span className="text-orange-500">clone</span>
          </span>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Sign in</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 rounded shadow-sm transition-colors mt-2"
          >
            Continue
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center mb-3">New to Amazon Clone?</p>
          <Link 
            to="/register"
            className="mt-4 w-full flex justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-normal py-2 px-4 border border-gray-300 rounded shadow-sm transition-colors"
          >
            Create your account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;