// src/redux/slices/categorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebase";
import {
  collection,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Product } from "../../models/ProductModel";
import { Exchange } from "../../models/ExchangeModel";
import { Transport } from "../../models/TransportModel";
import { Freelance } from "../../models/FreelanceModel";
import { Done } from "../../models/DoneModel";

// Map of category names to their model classes
const modelMap = {
  Products: Product,
  Exchange: Exchange,
  Transport: Transport,
  Freelance: Freelance,
  Done: Done,
};

// Generalized thunk creation with category-specific naming and model integration
const createCategoryThunks = (categoryName) => {
  const ModelClass = modelMap[categoryName];

  return {
    fetchItems: createAsyncThunk(`${categoryName}/fetchItems`, async () => {
      try {
        const snapshot = await getDocs(collection(db, categoryName));
        const items = snapshot.docs.map((doc) =>
          ModelClass.fromFirestore({ id: doc.id, ...doc.data() })
        );
        return items;
      } catch (error) {
        console.error(`Error fetching items from ${categoryName}:`, error);
        throw error;
      }
    }),

    fetchItemsById: createAsyncThunk(
      `${categoryName}/fetchItemsById`,
      async (_, { getState }) => {
        try {
          const { user } = getState().auth; // Access auth slice
          if (!user) throw new Error("User not authenticated");

          const q = query(
            collection(db, categoryName),
            where("ownerId", "==", user.uid) // Ensure field name matches your Firestore data
          );
          const snapshot = await getDocs(q);
          const items = snapshot.docs.map((doc) =>
            ModelClass.fromFirestore({ id: doc.id, ...doc.data() })
          ); // Use ModelClass here for consistency
          return items;
        } catch (error) {
          console.error(
            `Error fetching items from ${categoryName} by ID:`,
            error
          );
          throw error;
        }
      }
    ),

    addItem: createAsyncThunk(
      `${categoryName}/addItem`,
      async (data, { rejectWithValue }) => {
        let retries = 3;
        while (retries > 0) {
          try {
            const item = new ModelClass(data);
            console.log(`Adding to ${categoryName}:`, item);

            const docRef = doc(collection(db, categoryName));
            const itemData = {
              id: docRef.id,
              ownerId: getAuth().currentUser.uid,
              ...item.toFirestore({
                ...data,
                id: docRef.id,
                ownerId: getAuth().currentUser.uid,
              }),
            };

            await setDoc(docRef, itemData);
            console.log(
              `Document written to ${categoryName} with ID:`,
              docRef.id
            );
            return itemData;
          } catch (error) {
            console.error(`Error adding item to ${categoryName}:`, error);
            retries--;
            if (retries === 0) {
              return rejectWithValue(error.message);
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      }
    ),
    updateItem: createAsyncThunk(
      `${categoryName}/updateItem`,
      async ({ id, data }) => {
        try {
          const item = new ModelClass({ ...data, id });
          const docRef = doc(db, categoryName, id);
          await updateDoc(docRef, item.toFirestore());
          return item;
        } catch (error) {
          console.error(`Error updating item in ${categoryName}:`, error);
          throw error;
        }
      }
    ),

    deleteItem: createAsyncThunk(`${categoryName}/deleteItem`, async (id) => {
      try {
        const docRef = doc(db, categoryName, id);
        await deleteDoc(docRef);
        return id;
      } catch (error) {
        console.error(`Error deleting item from ${categoryName}:`, error);
        throw error;
      }
    }),
  };
};

// Generalized slice creation
const createCategorySlice = (categoryName) => {
  const thunks = createCategoryThunks(categoryName);

  return createSlice({
    name: categoryName,
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(thunks.fetchItems.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunks.fetchItems.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload;
        })
        .addCase(thunks.fetchItems.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
        .addCase(thunks.fetchItemsById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunks.fetchItemsById.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload;
        })
        .addCase(thunks.fetchItemsById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
        .addCase(thunks.addItem.fulfilled, (state, action) => {
          state.items.push(action.payload);
        })
        .addCase(thunks.addItem.rejected, (state, action) => {
          state.error = action.payload;
        })
        .addCase(thunks.updateItem.fulfilled, (state, action) => {
          const index = state.items.findIndex(
            (item) => item.id === action.payload.id
          );
          if (index !== -1) state.items[index] = action.payload;
        })
        .addCase(thunks.updateItem.rejected, (state, action) => {
          state.error = action.error.message;
        })
        .addCase(thunks.deleteItem.fulfilled, (state, action) => {
          state.items = state.items.filter(
            (item) => item.id !== action.payload
          );
        })
        .addCase(thunks.deleteItem.rejected, (state, action) => {
          state.error = action.error.message;
        });
    },
  });
};

// Create slices for each category
const productsSlice = createCategorySlice("Products");
const exchangeSlice = createCategorySlice("Exchange");
const doneSlice = createCategorySlice("Done");
const freelanceSlice = createCategorySlice("Freelance");
const transportSlice = createCategorySlice("Transport");

// Export thunks for use in components
export const productsThunks = createCategoryThunks("Products");
export const exchangeThunks = createCategoryThunks("Exchange");
export const doneThunks = createCategoryThunks("Done");
export const freelanceThunks = createCategoryThunks("Freelance");
export const transportThunks = createCategoryThunks("Transport");

// Export reducers

const categoryReducers = {
  products: productsSlice.reducer,
  exchange: exchangeSlice.reducer,
  done: doneSlice.reducer,
  freelance: freelanceSlice.reducer,
  transport: transportSlice.reducer,
};

export default categoryReducers;
