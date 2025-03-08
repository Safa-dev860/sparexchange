import { createSlice } from "@reduxjs/toolkit";

// Initial state for the cart
const initialState = {
  items: [], // Array to store cart items { id, name, price, quantity, image }
  totalQuantity: 0, // Total number of items in the cart
  totalAmount: 0, // Total price of all items
  purchasedItems: [], // Array to store purchased items
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }

      state.totalQuantity += 1;
      state.totalAmount += newItem.price;
    },

    // Delete a product from the cart
    deleteFromCart: (state, action) => {
      const itemId = action.payload;
      const itemToDelete = state.items.find((item) => item.id === itemId);

      if (itemToDelete) {
        state.totalQuantity -= itemToDelete.quantity;
        state.totalAmount -= itemToDelete.price * itemToDelete.quantity;
        state.items = state.items.filter((item) => item.id !== itemId);
      }
    },

    // Update the quantity of an item in the cart
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        const quantityDifference = quantity - item.quantity;
        state.totalQuantity += quantityDifference;
        state.totalAmount += item.price * quantityDifference;
        item.quantity = quantity > 0 ? quantity : 1;
      }
    },

    // Clear the entire cart
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },

    // Mark items as purchased and clear the cart
    purchaseItems: (state) => {
      if (state.items.length > 0) {
        state.purchasedItems.push(...state.items);
        state.items = []; // Clear the cart
        state.totalQuantity = 0;
        state.totalAmount = 0;
      }
    },
  },
});

export const {
  addToCart,
  deleteFromCart,
  updateQuantity,
  clearCart,
  purchaseItems,
} = cartSlice.actions;
export default cartSlice.reducer;
