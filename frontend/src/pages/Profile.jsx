import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMyOrders, cancelOrderAction, resetCancelState } from '../store/orderSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Pull user info and order history from Redux
  const { user } = useSelector((state) => state.auth);
  const { myOrders, loadingOrders, error, successCancel, loadingCancel } = useSelector((state) => state.order);

  // 2. Fetch the orders the moment this page loads 
  useEffect(() => {
    if (user) {
      dispatch(fetchMyOrders());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, user]);

  // 3. Refresh the order list if a cancellation is successful
  useEffect(() => {
    if (successCancel) {
      dispatch(fetchMyOrders());
      dispatch(resetCancelState());
    }
  }, [successCancel, dispatch]);

  // 4. Handle the cancellation click
  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      dispatch(cancelOrderAction(id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Account</h1>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Column: User Details (Read-Only) */}
        <div className="w-full md:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Profile Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600">Name</label>
                <p className="text-lg text-gray-900">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">Email Address</label>
                <p className="text-lg text-gray-900">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order History Table */}
        <div className="w-full md:w-2/3">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Order History</h2>
            
            {loadingOrders ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded">{error}</div>
            ) : myOrders.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                <Link to="/" className="text-blue-600 hover:underline font-medium">Start Shopping</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                      <th className="p-3 font-semibold">ORDER ID</th>
                      <th className="p-3 font-semibold">DATE</th>
                      <th className="p-3 font-semibold">TOTAL</th>
                      <th className="p-3 font-semibold">PAID</th>
                      <th className="p-3 font-semibold">DELIVERED</th>
                      <th className="p-3 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {myOrders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-mono text-xs text-gray-500">{order._id.substring(0, 10)}...</td>
                        <td className="p-3 text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="p-3 font-medium text-gray-900">₹{order.totalPrice.toFixed(2)}</td>
                        <td className="p-3">
                          {order.isPaid ? (
                            <span className="text-green-600 font-semibold">{new Date(order.paidAt).toLocaleDateString()}</span>
                          ) : (
                            <span className="text-red-500 font-semibold">Not Paid</span>
                          )}
                        </td>
                        <td className="p-3">
                          {/* UPDATED: Dynamic Status Rendering */}
                          {order.isCancelled ? (
                            <span className="text-red-600 font-semibold">Cancelled</span>
                          ) : order.isDelivered ? (
                            <span className="text-green-600 font-semibold">{new Date(order.deliveredAt).toLocaleDateString()}</span>
                          ) : (
                            <span className="text-orange-500 font-semibold">Processing</span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-2 whitespace-nowrap">
                          <Link to={`/order/${order._id}`} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded text-xs font-semibold transition-colors">
                            Details
                          </Link>
                          {/* UPDATED: Only show cancel button if not delivered AND not already cancelled */}
                          {!order.isDelivered && !order.isCancelled && (
                            <button 
                              onClick={() => handleCancel(order._id)}
                              disabled={loadingCancel}
                              className="bg-red-100 hover:bg-red-200 text-red-700 py-1 px-3 rounded text-xs font-semibold transition-colors disabled:opacity-50 inline-block"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;