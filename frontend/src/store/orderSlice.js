import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 1. Async Thunk to place a new order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post('http://localhost:5000/api/v1/orders', orderData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Order creation failed. Please try again.');
    }
  }
);

// 2. Async Thunk to fetch user's order history
export const fetchMyOrders = createAsyncThunk(
  'order/fetchMyOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('http://localhost:5000/api/v1/orders/myorders', config);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order history.');
    }
  }
);

// 3. Async Thunk to fetch a single order's details
export const getOrderDetails = createAsyncThunk(
  'order/getOrderDetails',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`http://localhost:5000/api/v1/orders/${id}`, config);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order details');
    }
  }
);

// 4. Async Thunk to cancel an order
export const cancelOrderAction = createAsyncThunk(
  'order/cancelOrder',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.put(`http://localhost:5000/api/v1/orders/${id}/cancel`, {}, config);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
    }
  }
);

// 5. The Slice
const orderSlice = createSlice({
  name: 'order',
  initialState: {
    loading: false,
    success: false,
    order: null,
    error: null,
    myOrders: [],     
    loadingOrders: false,
    orderDetails: null,
    loadingDetails: true,
    // Cancel state
    loadingCancel: false,
    successCancel: false,
  },
  reducers: {
    clearOrderSuccess(state) {
      state.success = false;
      state.order = null;
      state.error = null;
    },
    resetCancelState(state) {
      state.successCancel = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---- Cases for Creating an Order ----
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload.data;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload; 
      })
      
      // ---- Cases for Fetching My Orders (History) ----
      .addCase(fetchMyOrders.pending, (state) => {
        state.loadingOrders = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loadingOrders = false;
        state.myOrders = action.payload; 
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loadingOrders = false;
        state.error = action.payload;
      })

      // ---- Cases for Order Details ----
      .addCase(getOrderDetails.pending, (state) => {
        state.loadingDetails = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loadingDetails = false;
        state.error = action.payload;
      })
      
      // ---- Cases for Canceling Order ----
      .addCase(cancelOrderAction.pending, (state) => {
        state.loadingCancel = true;
      })
      .addCase(cancelOrderAction.fulfilled, (state) => {
        state.loadingCancel = false;
        state.successCancel = true;
      })
      .addCase(cancelOrderAction.rejected, (state, action) => {
        state.loadingCancel = false;
        state.error = action.payload;
      }); // <-- Only ONE semicolon here at the very end of the builder!
  },
});

export const { clearOrderSuccess, resetCancelState } = orderSlice.actions;
export default orderSlice.reducer;