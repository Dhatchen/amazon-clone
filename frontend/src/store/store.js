import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import productReducer from './productSlice';
import orderReducer from './orderSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    products: productReducer,
    order: orderReducer,
  },
});

export default store;