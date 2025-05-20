import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startNewConversation,
  fetchOneConversation,
  sendMessage,
} from "../../redux/slices/conversationSlice";
import { FaHeart } from "react-icons/fa";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";
import ConversationView from "../exchange/ConversationView";

const DoneInfoWidget = ({
  done,
  onToggleFavorite,
  onSendRequest,
  showConversation = true, // Add this prop to optionally show conversation
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { conversations, status } = useSelector((state) => state.conversation);
  const [newMessage, setNewMessage] = useState("");
  const [existingConversationId, setExistingConversationId] = useState(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const messagesContainerRef = useRef(null);

  // Check if current user is the done owner
  const isOwner = user?.uid === done?.owner?.id;

  // Check for existing conversation
  useEffect(() => {
    if (!showConversation) return;

    const checkExistingConversation = async () => {
      if (!user?.uid || !done?.id || isOwner) {
        setIsLoadingConversation(false);
        return;
      }

      const firestore = getFirestore();
      const q = query(
        collection(firestore, "Conversations"),
        where("productId", "==", done.id),
        where("participants", "array-contains", user.uid)
      );

      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const conversationId = doc.id;
          setExistingConversationId(conversationId);
          dispatch(
            fetchOneConversation({
              productId: done.id,
              conversationId,
            })
          );
        }
      } catch (error) {
        console.error("Error checking for existing conversation:", error);
      } finally {
        setIsLoadingConversation(false);
      }
    };

    checkExistingConversation();
  }, [dispatch, done.id, user?.uid, isOwner, showConversation]);

  // Set up real-time listener for conversation updates
  useEffect(() => {
    if (!showConversation || !existingConversationId || !done?.id) return;

    const db = getDatabase();
    const conversationRef = ref(
      db,
      `products/${done.id}/conversations/${existingConversationId}`
    );

    const unsubscribe = onValue(conversationRef, (snapshot) => {
      if (snapshot.exists()) {
        dispatch(
          fetchOneConversation({
            productId: done.id,
            conversationId: existingConversationId,
            conversationData: snapshot.val(),
          })
        );
      }
    });

    return () => unsubscribe();
  }, [existingConversationId, done?.id, dispatch, showConversation]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [conversations, existingConversationId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isOwner || !showConversation) return;

    if (existingConversationId) {
      dispatch(
        sendMessage({
          productId: done.id,
          conversationId: existingConversationId,
          senderId: user.uid,
          message: newMessage,
          clientId: done.owner.id,
          buyerId: user.uid,
        })
      );
    } else {
      dispatch(
        startNewConversation({
          productId: done.id,
          client: {
            username: done.owner.name,
            id: done.owner.id,
            profileUrl: done.owner.imageUrl,
          },
          buyer: {
            username: user.name,
            id: user.uid,
            profileUrl: user.profilePicture,
          },
          initialMessage: newMessage,
        })
      )
        .unwrap()
        .then((result) => {
          setExistingConversationId(result.conversationId);
        });
    }

    setNewMessage("");
  };

  const currentConversation = existingConversationId
    ? conversations[existingConversationId]
    : null;

  if (isLoadingConversation && showConversation) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
        <p className="ml-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col md:flex-row bg-white rounded-xl shadow-lg p-6 gap-6">
      {/* Images Gallery (Left on desktop, Top on mobile) */}
      <div className="md:w-1/2 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-4 tracking-tight">
          Proof Images
        </h3>
        {done.proofImages?.length > 0 ? (
          <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {done.proofImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Proof ${index + 1}`}
                className="w-32 h-32 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-200 flex-shrink-0"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No proof images available.</p>
        )}
        <h2 className="text-2xl font-bold text-gray-800 mb-4 tracking-tight">
          {done.doneTitle}
        </h2>

        <div className="space-y-3 text-gray-700 flex-1">
          <p>
            <span className="font-semibold">Owner:</span>{" "}
            {done.owner.name || "Anonymous"}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {done.status?.charAt(0).toUpperCase() + done.status?.slice(1)}
          </p>
          <p>
            <span className="font-semibold">Completion Date:</span>{" "}
            {done.completionDate
              ? new Date(done.completionDate).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <span className="font-semibold">Remarks:</span>{" "}
            {done.remarks || "No remarks provided."}
          </p>
          <p>
            <span className="font-semibold">Created:</span>{" "}
            {new Date(done.createdAt).toLocaleString()}
          </p>
          {done.completedAt && (
            <p>
              <span className="font-semibold">Completed:</span>{" "}
              {new Date(done.completedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Details and Conversation (Right on desktop, Bottom on mobile) */}
      <div className="w-full flex flex-col">
        {showConversation && !isOwner ? (
          <div className="mt-4 border rounded-lg flex flex-col h-[calc(100vh-300px)] min-h-[300px]">
            <div className="border-b p-4 flex flex-row items-center gap-2 sticky top-0 bg-white z-10">
              <img
                src={done?.owner?.imageUrl}
                alt="Owner"
                className="w-10 h-10 rounded-full object-cover"
              />
              <h1>{done?.owner?.name}</h1>
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4"
            >
              <ConversationView
                conversation={currentConversation}
                currentUserId={user?.uid}
                status={status}
              />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="border-t p-4 sticky bottom-0 bg-white"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                  placeholder={
                    currentConversation
                      ? "Type your message..."
                      : "Type your first message..."
                  }
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  disabled={!newMessage.trim()}
                >
                  {currentConversation ? "Send" : "Start Chat"}
                </button>
              </div>
            </form>
          </div>
        ) : showConversation && isOwner ? (
          <div className="mt-6 text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              This is your done. You can't message yourself.
            </p>
          </div>
        ) : (
          <div className="mt-6 flex gap-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite();
              }}
              className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center"
            >
              <FaHeart />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                onSendRequest();
              }}
              className="flex-1 p-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-200"
            >
              Send Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoneInfoWidget;
