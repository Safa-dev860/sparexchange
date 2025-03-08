// import { createSlice } from "@reduxjs/toolkit";

// // Initial state for the wishlist
// const initialState = {
//   items: [], // Array to store wishlist items { id, name, price, image }
// };

// const wishlistSlice = createSlice({
//   name: "wishlist",
//   initialState,
//   reducers: {
//     // Add an item to the wishlist
//     addToWishlist: (state, action) => {
//       const newItem = action.payload;
//       const existingItem = state.items.find((item) => item.id === newItem.id);

//       if (!existingItem) {
//         state.items.push(newItem); // Add new item if it doesn't exist
//       }
//     },

//     // Remove (unlike) an item from the wishlist
//     removeFromWishlist: (state, action) => {
//       const itemId = action.payload;
//       state.items = state.items.filter((item) => item.id !== itemId);
//     },

//     // Add a new product to the wishlist (e.g., for future purchases)
//     addNewProduct: (state, action) => {
//       const newProduct = action.payload;
//       const existingProduct = state.items.find(
//         (item) => item.id === newProduct.id
//       );

//       if (!existingProduct) {
//         state.items.push(newProduct); // Add new product if it doesn't exist
//       }
//     },

//     // Clear the entire wishlist
//     clearWishlist: (state) => {
//       state.items = [];
//     },
//   },
// });

// export const {
//   addToWishlist,
//   removeFromWishlist,
//   addNewProduct,
//   clearWishlist,
// } = wishlistSlice.actions;
// export default wishlistSlice.reducer;
