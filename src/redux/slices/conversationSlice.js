import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDatabase, ref, set, get, push, update } from "firebase/database";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const initialState = {
  conversations: {},
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  activeConversationId: null,
};

// Helper to validate conversation data
const validateConversationData = (data) => {
  if (!data.client || !data.client.id || !data.buyer || !data.buyer.id) {
    throw new Error("Invalid conversation data: missing required user IDs");
  }
  return {
    ...data,
    client: {
      username: data.client.username || "",
      id: data.client.id,
      profileUrl: data.client.profileUrl || "",
    },
    buyer: {
      username: data.buyer.username || "",
      id: data.buyer.id,
      profileUrl: data.buyer.profileUrl || "",
    },
  };
};

// Start a new conversation (writes to both Firestore and Realtime DB)
export const startNewConversation = createAsyncThunk(
  "conversation/startNewConversation",
  async ({ productId, client, buyer, initialMessage }, { rejectWithValue }) => {
    try {
      const db = getDatabase();
      const firestore = getFirestore();
      const conversationId = `${buyer.id}_${productId}`;

      // Validate and prepare data
      const validated = validateConversationData({ client, buyer });
      const timestamp = new Date().toISOString();

      // Realtime DB structure
      const rtConversationData = {
        isClosed: false,
        client: validated.client,
        buyer: validated.buyer,
        messages: {
          [Date.now()]: {
            senderId: buyer.id,
            content: initialMessage,
            timestamp,
            read: false,
          },
        },
        lastMessage: initialMessage,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      // Firestore structure
      const fsConversationData = {
        conversationId,
        productId,
        buyerId: buyer.id,
        sellerId: client.id,
        participants: [buyer.id, client.id],
        lastMessage: initialMessage,
        lastMessageTime: timestamp,
        isClosed: false,
        createdAt: timestamp,
      };

      // Write to both databases
      await Promise.all([
        set(
          ref(db, `products/${productId}/conversations/${conversationId}`),
          rtConversationData
        ),
        setDoc(
          doc(firestore, "Conversations", conversationId),
          fsConversationData
        ),
      ]);

      return {
        conversationId,
        conversation: rtConversationData,
        firestoreData: fsConversationData,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch a single conversation from Realtime DB
export const fetchOneConversation = createAsyncThunk(
  "conversation/fetchOneConversation",
  async ({ productId, conversationId }, { rejectWithValue }) => {
    try {
      const db = getDatabase();
      const conversationRef = ref(
        db,
        `products/${productId}/conversations/${conversationId}`
      );
      const snapshot = await get(conversationRef);

      if (!snapshot.exists()) {
        return rejectWithValue("Conversation not found");
      }

      const data = snapshot.val();
      const messages = data.messages
        ? Object.entries(data.messages).map(([id, msg]) => ({ id, ...msg }))
        : [];

      return {
        conversationId,
        conversation: {
          ...data,
          messages,
        },
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Send a new message
export const sendMessage = createAsyncThunk(
  "conversation/sendMessage",
  async (
    { productId, conversationId, senderId, message },
    { rejectWithValue }
  ) => {
    try {
      const db = getDatabase();
      const firestore = getFirestore();
      const timestamp = new Date().toISOString();

      // 1. Add message to Realtime DB
      const messagesRef = ref(
        db,
        `products/${productId}/conversations/${conversationId}/messages`
      );
      const newMessageRef = push(messagesRef);
      const newMessage = {
        senderId,
        content: message,
        timestamp,
        read: false,
      };

      // 2. Update lastMessage in both Realtime DB and Firestore
      const updates = {
        // Update Realtime DB's conversation metadata
        [`products/${productId}/conversations/${conversationId}/lastMessage`]:
          message,

        [`products/${productId}/conversations/${conversationId}/updatedAt`]:
          timestamp,
        // Add the new message
        [`products/${productId}/conversations/${conversationId}/messages/${newMessageRef.key}`]:
          newMessage,
      };

      await Promise.all([
        // Batch update Realtime DB
        update(ref(db), updates),
        // Update Firestore
        setDoc(
          doc(firestore, "Conversations", conversationId),
          {
            lastMessage: message,
            lastMessageTime: timestamp,
            updatedAt: timestamp,
          },
          { merge: true }
        ),
      ]);

      return {
        conversationId,
        message: {
          id: newMessageRef.key,
          ...newMessage,
        },
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch all conversations for a user from Firestore
export const fetchUserConversations = createAsyncThunk(
  "conversation/fetchUserConversations",
  async (userId, { rejectWithValue }) => {
    try {
      const firestore = getFirestore();
      const q = query(
        collection(firestore, "Conversations"),
        where("participants", "array-contains", userId)
      );

      const snapshot = await getDocs(q);
      const conversations = {};

      snapshot.forEach((doc) => {
        conversations[doc.id] = doc.data();
      });

      return conversations;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Close a conversation
export const closeConversation = createAsyncThunk(
  "conversation/closeConversation",
  async ({ conversationId }, { rejectWithValue }) => {
    try {
      const firestore = getFirestore();
      await setDoc(
        doc(firestore, "Conversations", conversationId),
        {
          isClosed: true,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      return { conversationId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add this to your existing conversationSlice.js
export const fetchProductConversations = createAsyncThunk(
  "conversation/fetchProductConversations",
  async (productId, { rejectWithValue }) => {
    try {
      const firestore = getFirestore();
      const q = query(
        collection(firestore, "Conversations"),
        where("productId", "==", productId)
      );

      const querySnapshot = await getDocs(q);
      const conversations = {};

      querySnapshot.forEach((doc) => {
        conversations[doc.id] = doc.data();
      });

      return conversations;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add to extraReducers
// extraReducers: (builder) => {
//   builder

// }

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload;
    },
    clearConversations: (state) => {
      state.conversations = {};
      state.activeConversationId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start New Conversation
      .addCase(startNewConversation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(startNewConversation.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { conversationId, conversation } = action.payload;
        state.conversations[conversationId] = conversation;
        state.activeConversationId = conversationId;
      })
      .addCase(startNewConversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch One Conversation
      .addCase(fetchOneConversation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOneConversation.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { conversationId, conversation } = action.payload;
        state.conversations[conversationId] = conversation;
        state.activeConversationId = conversationId;
      })
      .addCase(fetchOneConversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch Product Conversations
      .addCase(fetchProductConversations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations = action.payload;
      })
      .addCase(fetchProductConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch User Conversations
      .addCase(fetchUserConversations.fulfilled, (state, action) => {
        state.conversations = { ...state.conversations, ...action.payload };
      })

      // Close Conversation
      .addCase(closeConversation.fulfilled, (state, action) => {
        const { conversationId } = action.payload;
        if (state.conversations[conversationId]) {
          state.conversations[conversationId].isClosed = true;
        }
      });
  },
});

export const { setActiveConversation, clearConversations } =
  conversationSlice.actions;
export default conversationSlice.reducer;
