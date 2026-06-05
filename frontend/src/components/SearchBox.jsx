import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-grow max-w-3xl mx-4">
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search products..."
        // UPDATED: Added bg-white and text-black
        className="w-full px-4 py-2 bg-white text-black placeholder-gray-500 rounded-l focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <button
        type="submit"
        className="px-5 py-2 bg-orange-400 hover:bg-orange-500 text-gray-900 rounded-r transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  );
};

export default SearchBox;