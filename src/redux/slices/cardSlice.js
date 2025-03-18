import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebase";
import { collection, doc, getDoc, updateDoc, addDoc } from "firebase/firestore";

// Initial state
const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  purchasedItems: [],
  status: "idle", // Add a status field to track async state
  error: null, // Add an error field to store errors
};

// Async thunk for purchasing items
export const purchaseItems = createAsyncThunk(
  "cart/purchaseItems",
  async ({ userId }, { getState }) => {
    try {
      // Access the current cart state
      const state = getState();
      const { items, totalAmount } = state.cart;
      console.log("items : ", items);
      // Ensure user data exists
      const userDocRef = doc(db, "Users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        throw new Error("User document does not exist");
      }

      const userData = userDocSnap.data();
      const userBalance = userData.balance;

      if (items.length > 0 && userBalance >= totalAmount) {
        // Create transactions for each item
        for (const item of items) {
          // Ensure seller data exists
          const sellerDocRef = doc(db, "Users", item.ownerId);
          const sellerDocSnap = await getDoc(sellerDocRef);

          if (!sellerDocSnap.exists()) {
            console.error(
              `Seller document for sellerId ${item.ownerId} does not exist`
            );
            continue;
          }

          const sellerData = sellerDocSnap.data();
          const newSellerBalance =
            sellerData.balance + item.price * item.quantity;

          await updateDoc(sellerDocRef, { balance: newSellerBalance });

          // Store transaction in Firestore
          const transaction = {
            buyerId: userId,
            sellerId: item.ownerId,
            itemId: item.id,
            quantity: item.quantity,
            totalPrice: item.price * item.quantity,
            timestamp: new Date(),
          };

          await addDoc(collection(db, "Transactions"), transaction);
        }

        // Deduct total amount from user's balance
        const newBalance = userBalance - totalAmount;
        await updateDoc(userDocRef, { balance: newBalance });

        // Return the purchased items to update the state
        return items;
      } else {
        throw new Error("Insufficient balance or no items in cart");
      }
    } catch (error) {
      console.error("Error processing purchase:", error);
      throw error; // Re-throw the error to handle it in the reducer
    }
  }
);

// Create the slice
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
    deleteFromCart: (state, action) => {
      const itemId = action.payload;
      const itemToDelete = state.items.find((item) => item.id === itemId);
      if (itemToDelete) {
        state.totalQuantity -= itemToDelete.quantity;
        state.totalAmount -= itemToDelete.price * itemToDelete.quantity;
        state.items = state.items.filter((item) => item.id !== itemId);
      }
    },
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
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(purchaseItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(purchaseItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.purchasedItems.push(...action.payload);
        state.items = [];
        state.totalQuantity = 0;
        state.totalAmount = 0;
      })
      .addCase(purchaseItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export actions and reducer
export const { addToCart, deleteFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
