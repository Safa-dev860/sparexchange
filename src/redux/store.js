import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import authReducer from "./auth/authSlice"; // Adjust path as needed
import categoryReducers from "./slices/categorySlice"; // Your category reducers
import cartReducer from "./slices/cardSlice";
// Persist config for auth slice
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token"], // Only persist these fields from auth
};

// Wrap auth reducer with persistence
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Configure the store
export const store = configureStore({
  reducer: {
    ...categoryReducers, // Spreads: products, exchange, done, freelance, transport
    auth: persistedAuthReducer, // Persisted auth reducer
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable to handle non-serializable Firebase data
      immutableCheck: false, // Disable immutable check for performance
    }),
});

// Create persistor for redux-persist
export const persistor = persistStore(store);
