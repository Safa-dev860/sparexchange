import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  googleProvider,
  facebookProvider,
  signInWithPopup,
  db,
} from "../../firebase/firebase";
import {
  collection,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { AuthStatus } from "../types";

// Initial state
const initialState = {
  user: null,
  token: null,
  status: AuthStatus.IDLE,
  error: null,
};

// Helper function to fetch or create user data in Firestore
const getOrCreateUserData = async (user) => {
  const userDocRef = doc(db, "Users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    // Return existing Firestore data
    return userDocSnap.data();
  } else {
    // Create new user data if it doesn’t exist
    const userData = {
      uid: user.uid,
      role: "client",
      email: user.email,
      name: user.displayName || "Unknown",
      birthday: null,
      profilePicture: user.photoURL || null,
    };
    await setDoc(userDocRef, userData);
    return userData;
  }
};

// Async Thunk for Google Sign-In
export const signInWithGoogle = createAsyncThunk(
  "auth/googleSignIn",
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Fetch or create user data from Firestore
      const userData = await getOrCreateUserData(user);

      // Combine Firebase Auth and Firestore data
      const data = {
        uid: user.uid,
        email: user.email,
        refreshToken: user.refreshToken,
        ...userData,
      };
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk for Facebook Sign-In
export const signInWithFacebook = createAsyncThunk(
  "auth/facebookSignIn",
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      // Fetch or create user data from Firestore
      const userData = await getOrCreateUserData(user);

      // Combine Firebase Auth and Firestore data
      const data = {
        uid: user.uid,
        email: user.email,
        refreshToken: user.refreshToken,
        ...userData,
      };
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk for Sign Up
export const signUp = createAsyncThunk(
  "auth/signUp",
  async (
    { email, password, name, birthday, profilePicture },
    { rejectWithValue }
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create user data in Firestore
      const userData = {
        uid: user.uid,
        role: "client",
        email: user.email,
        name: name,
        birthday: birthday,
        profilePicture: profilePicture || null,
      };
      await setDoc(doc(db, "Users", user.uid), userData);

      // Combine Firebase Auth and Firestore data
      const data = {
        uid: user.uid,
        email: user.email,
        refreshToken: user.refreshToken,
        ...userData,
      };
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk for Sign In
export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch user data from Firestore
      const userDocRef = doc(db, "Users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        throw new Error("No user data found in Firestore for this UID");
      }

      const userData = userDocSnap.data();

      // Combine Firebase Auth and Firestore data
      const data = {
        uid: user.uid,
        email: user.email,
        refreshToken: user.refreshToken,
        ...userData,
      };
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk for Logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk for Password Reset
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (email, { rejectWithValue }) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return "Password reset email sent! Check your inbox.";
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.status = AuthStatus.IDLE;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.status = AuthStatus.LOADING;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = AuthStatus.SUCCEEDED;
        state.user = action.payload; // Now includes Firestore data
        state.token = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = AuthStatus.FAILED;
        state.error = action.payload;
      })

      // Sign In
      .addCase(signIn.pending, (state) => {
        state.status = AuthStatus.LOADING;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = AuthStatus.SUCCEEDED;
        state.user = action.payload; // Now includes Firestore data
        state.token = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = AuthStatus.FAILED;
        state.error = action.payload;
      })

      // Google Sign-In
      .addCase(signInWithGoogle.pending, (state) => {
        state.status = AuthStatus.LOADING;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.status = AuthStatus.SUCCEEDED;
        state.user = action.payload; // Now includes Firestore data
        state.token = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.status = AuthStatus.FAILED;
        state.error = action.payload;
      })

      // Facebook Sign-In
      .addCase(signInWithFacebook.pending, (state) => {
        state.status = AuthStatus.LOADING;
      })
      .addCase(signInWithFacebook.fulfilled, (state, action) => {
        state.status = AuthStatus.SUCCEEDED;
        state.user = action.payload; // Now includes Firestore data
        state.token = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(signInWithFacebook.rejected, (state, action) => {
        state.status = AuthStatus.FAILED;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.status = AuthStatus.LOADING;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = AuthStatus.IDLE;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = AuthStatus.FAILED;
        state.error = action.payload;
      })

      // Password Reset
      .addCase(resetPassword.pending, (state) => {
        state.status = AuthStatus.LOADING;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = AuthStatus.SUCCEEDED;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = AuthStatus.FAILED;
        state.error = action.payload;
      });
  },
});

// Persist config
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token"],
  blacklist: ["status", "error"],
};

// Wrap reducer with persistReducer
const authReducer = persistReducer(persistConfig, authSlice.reducer);

// Export actions
export const { clearAuthState } = authSlice.actions;

// Export persisted reducer
export default authReducer;
