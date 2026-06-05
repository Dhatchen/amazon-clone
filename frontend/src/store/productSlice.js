import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 1. The Async Function to fetch live data
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (keyword = '') => {
  const response = await axios.get('http://localhost:5000/api/v1/products', {
    params: { keyword }
  });
  
  // Map MongoDB's '_id' to standard 'id' so our Cart and routing don't break
  const formattedData = response.data.data.map(product => ({
    ...product,
    id: product._id
  }));
  
  return formattedData;
});

// 2. The Slice that remembers the loading state
const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // Save the live database items to Redux!
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default productSlice.reducer;