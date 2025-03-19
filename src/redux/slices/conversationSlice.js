import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDatabase, ref, onValue, push, set } from "firebase/database";

const initialState = {
  conversations: {},
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Fetch conversations from Firebase
export const fetchConversations = createAsyncThunk(
  "conversation/fetchConversations",
  async ({ productId, userId }, { rejectWithValue }) => {
    try {
      const database = getDatabase();
      const conversationsRef = ref(
        database,
        `products/${productId}/conversations`
      );
      const conversations = {};

      onValue(conversationsRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const conversationId = childSnapshot.key;
          const conversationData = childSnapshot.val();
          // Convert messages object to array
          const messagesArray = Object.values(conversationData.messages || {});
          conversations[conversationId] = {
            messages: messagesArray,
          };
        });
      });

      return conversations;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Send a message to Firebase
export const sendMessage = createAsyncThunk(
  "conversation/sendMessage",
  async (
    { productId, conversationId, senderId, receiverId, message },
    { rejectWithValue }
  ) => {
    try {
      const database = getDatabase();
      const messageRef = ref(
        database,
        `products/${productId}/conversations/${conversationId}/messages`
      );
      const newMessageRef = push(messageRef);

      await set(newMessageRef, {
        sender: senderId,
        receiver: receiverId,
        content: message,
        timestamp: new Date().toISOString(),
      });

      console.log("Message sent successfully");
      return {
        conversationId,
        message: {
          sender: senderId,
          receiver: receiverId,
          content: message,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("Error sending message:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    // Add any synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations = { ...state.conversations, ...action.payload };
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default conversationSlice.reducer;
