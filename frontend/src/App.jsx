import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Profile from './pages/Profile';
import Register from './pages/Register';
import OrderDetails from './pages/OrderDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* All routes inside this block will share the MainLayout (Navbar + Footer) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="cart" element={<Cart />} />
          <Route path="/register" element={<Register />} />
          {/* The Protected Checkout Route */}
          <Route path="checkout" element={<ProtectedRoute> <Checkout /> </ProtectedRoute>} />
          <Route path="order-confirmation/:id" element={<ProtectedRoute> <OrderConfirmation /> </ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
          <Route path="order/:id" element={<ProtectedRoute> <OrderDetails /> </ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;