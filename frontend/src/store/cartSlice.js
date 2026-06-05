import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
  shippingAddress: JSON.parse(localStorage.getItem('shippingAddress')) || {},
  paymentMethod: 'Credit Card',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 1. Add Item (You already have this)
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      
      state.totalQuantity++;
      
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          image: newItem.image,
          quantity: 1,
          totalPrice: newItem.price,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice += newItem.price;
      }
    },

    // 2. Remove Item Completely
    removeItem(state, action) {
      const id = action.payload; // We only need the ID to find it
      const existingItem = state.items.find((item) => item.id === id);
      
      if (existingItem) {
        // Subtract this item's quantity from the global cart total
        state.totalQuantity -= existingItem.quantity;
        // Filter the array to return everything EXCEPT the item we want to delete
        state.items = state.items.filter((item) => item.id !== id);
      }
    },

    // 3. Increase Quantity by 1
    increaseQuantity(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      
      state.totalQuantity++;
      existingItem.quantity++;
      existingItem.totalPrice += existingItem.price;
    },

    // 4. Decrease Quantity by 1
    decreaseQuantity(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      
      state.totalQuantity--;
      
      // If there's only 1 left, decreasing it means we remove it entirely
      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice -= existingItem.price;
      }
    },

    saveShippingAddress(state, action) {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod(state, action) {
      state.paymentMethod = action.payload;
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
    },
    clearShippingAddress: (state) => {
      state.shippingAddress = {};
      localStorage.removeItem('shippingAddress');
    },
  },
});

// Export all the new actions so our components can use them!
export const { addToCart, removeItem, increaseQuantity, decreaseQuantity, saveShippingAddress, savePaymentMethod, clearCart, clearShippingAddress } = cartSlice.actions;
export default cartSlice.reducer;