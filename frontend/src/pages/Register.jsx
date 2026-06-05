import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Local state for validation errors
  const [validationError, setValidationError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Pull auth state from Redux
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // If already logged in, redirect to the home page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    setValidationError('');

    // 1. Validate passwords match
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    // 2. Validate password length
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    // 3. Dispatch registration
    dispatch(registerUser({ name, email, mobileNumber: mobile, password }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tighter">amazon<span className="text-orange-500">clone</span></h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          <h2 className="text-2xl font-normal text-gray-900 mb-6">Create account</h2>

          {/* Show Errors */}
          {(validationError || error) && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">
              {validationError || error}
            </div>
          )}

          <form className="space-y-4" onSubmit={submitHandler}>
            
            {/* 1. Name */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Your name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="First and last name" className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm" />
            </div>

            {/* 2. Email */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm" />
            </div>

            {/* 3. Mobile Number */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Mobile number</label>
              <input type="tel" required value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10-digit mobile number" className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm" />
            </div>

            {/* 4. Password */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm" />
              <p className="text-xs text-gray-500 mt-1">Passwords must be at least 6 characters.</p>
            </div>

            {/* 5. Re-enter Password */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Re-enter password</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm" />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-normal py-2 px-4 rounded shadow-sm border border-yellow-500 transition-colors mt-2"
            >
              {loading ? 'Creating Account...' : 'Continue'}
            </button>

          </form>

          <div className="mt-6 text-sm text-gray-700">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;