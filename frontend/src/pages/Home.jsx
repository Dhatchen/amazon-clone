import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import ProductCard from '../components/ProductCard';
import { categories } from '../utils/mockData'; 

const Home = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  
  // Extract keyword from URL (e.g., localhost:5173/?keyword=phone)
  const keyword = searchParams.get('keyword') || '';
  
  // Pull the live data and loading status from Redux
  const { items: liveProducts, status, error } = useSelector((state) => state.products);

  // Trigger the API call when the page loads OR when the keyword changes
  useEffect(() => {
    dispatch(fetchProducts(keyword));
  }, [dispatch, keyword]);

  // Loading and Error UI
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  if (status === 'failed') {
    return <div className="text-center py-20 text-red-500 text-xl font-bold">Error: {error}</div>;
  }

  return (
    <div className="space-y-12 pb-12">
      {/* If there's a keyword and no products are found, show a message */}
      {keyword && liveProducts.length === 0 && (
        <div className="text-center py-20 text-xl text-gray-600 font-semibold">
          No products found matching "{keyword}"
        </div>
      )}

      {categories.map((category) => {
        // Filter the LIVE MongoDB products by category
        const categoryProducts = liveProducts.filter(p => p.category === category);

        // Don't render the section if there are no products for it
        if (categoryProducts.length === 0) return null;

        return (
          <section key={category} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
              Explore {category}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Home;