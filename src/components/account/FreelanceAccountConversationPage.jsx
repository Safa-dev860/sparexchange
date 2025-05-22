// export default ExchangeAccountConversationPage;
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductConversations,
  fetchOneConversation,
  sendMessage,
} from "../../redux/slices/conversationSlice";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";

const ConversationsPage = ({
  documentType = "Freelance", // Firestore collection name
  documentPath = "products", // Realtime Database path
  titleField = "itemOffered", // Field to display as title
  subtitleField = "itemWanted", // Field to display as subtitle
  backButton = true, // Show back button
  emptyMessage = "No conversations yet", // Custom empty message
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { conversations, status } = useSelector((state) => state.conversation);
  const [document, setDocument] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loadingDocument, setLoadingDocument] = useState(true);
  const [unsubscribers, setUnsubscribers] = useState([]);
  const messagesContainerRef = useRef(null);

  // Safe timestamp conversion
  const convertFirestoreTimestamp = (timestamp) => {
    if (!timestamp) return null;
    try {
      if (typeof timestamp.toDate === "function")
        return timestamp.toDate().toISOString();
      if (timestamp instanceof Date) return timestamp.toISOString();
      return new Date(timestamp).toISOString();
    } catch (error) {
      console.error("Error converting timestamp:", timestamp, error);
      return null;
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [conversations, activeConversation]);

  // Fetch document details
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const firestore = getFirestore();
        const docRef = doc(firestore, documentType, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const docData = docSnap.data();
          setDocument({
            id: docSnap.id,
            ...docData,
            createdAt: convertFirestoreTimestamp(docData.createdAt),
            updatedAt: convertFirestoreTimestamp(docData.updatedAt),
            owner: docData.owner || {
              id: docData.ownerId || "",
              name: "",
              email: "",
              imageUrl: "",
            },
          });
        } else {
          navigate("/not-found", { replace: true });
        }
      } catch (error) {
        console.error(`Error fetching ${documentType}:`, error);
        navigate("/error", { replace: true });
      } finally {
        setLoadingDocument(false);
      }
    };

    if (id) fetchDocument();
    else navigate("/not-found", { replace: true });
  }, [id, navigate, documentType]);

  // Fetch conversations and set up real-time listeners
  useEffect(() => {
    if (!id || loadingDocument) return;

    const db = getDatabase();
    let newUnsubscribers = [];

    dispatch(fetchProductConversations(id))
      .unwrap()
      .then((convs) => {
        if (convs && Object.keys(convs).length > 0) {
          setActiveConversation(Object.keys(convs)[0]);

          // Set up real-time listeners for all conversations
          Object.keys(convs).forEach((convId) => {
            const conversationRef = ref(
              db,
              `${documentPath}/${id}/conversations/${convId}`
            );
            const unsubscribe = onValue(conversationRef, (snapshot) => {
              if (snapshot.exists()) {
                dispatch(
                  fetchOneConversation({
                    productId: id,
                    conversationId: convId,
                    conversationData: snapshot.val(),
                  })
                );
              }
            });
            newUnsubscribers.push(unsubscribe);
          });
          setUnsubscribers(newUnsubscribers);
        }
      })
      .catch(console.error);

    // Cleanup function
    return () => {
      newUnsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [id, dispatch, loadingDocument, documentPath]);

  // Clean up real-time listeners on unmount
  useEffect(() => {
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [unsubscribers]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || !document) return;

    dispatch(
      sendMessage({
        productId: id,
        conversationId: activeConversation,
        senderId: user?.uid,
        message: newMessage,
        clientId: document.owner?.id,
        buyerId: user?.uid,
      })
    );

    setNewMessage("");
  };

  if (loadingDocument || status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700 ml-2"></div>
        <p className="ml-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {documentType} not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <div className="flex items-center mb-6">
        {backButton && (
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold">{document[titleField]}</h1>
          {subtitleField && document[subtitleField] && (
            <p className="text-gray-600">{document[subtitleField]}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Conversation list */}
        <div className="w-full md:w-1/3 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="font-semibold">
              Conversations ({Object.keys(conversations).length})
            </h2>
          </div>
          <div className="divide-y">
            {Object.entries(conversations).length > 0 ? (
              Object.entries(conversations).map(([convId, conv]) => {
                if (!conv) return null;

                const isCurrentUserBuyer = conv.buyer?.id === user?.uid;
                const otherUser = isCurrentUserBuyer ? conv.client : conv.buyer;
                const lastMessage = Array.isArray(conv.messages)
                  ? [...conv.messages].sort((a, b) => {
                      const dateA = a?.timestamp
                        ? new Date(a.timestamp)
                        : new Date(0);
                      const dateB = b?.timestamp
                        ? new Date(b.timestamp)
                        : new Date(0);
                      return dateB - dateA;
                    })[0]
                  : null;

                return (
                  <div
                    key={convId}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      activeConversation === convId ? "bg-blue-50" : ""
                    }`}
                    onClick={() => setActiveConversation(convId)}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3 overflow-hidden">
                        {otherUser?.profileUrl ? (
                          <img
                            src={otherUser.profileUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/150";
                            }}
                          />
                        ) : (
                          <span className="text-sm font-medium">
                            {otherUser?.username?.charAt(0)?.toUpperCase() ||
                              "U"}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">
                          {otherUser?.username ||
                            (isCurrentUserBuyer ? "Client" : "Buyer")}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {lastMessage?.content || "No messages yet"}
                        </p>
                      </div>
                      {lastMessage && (
                        <div className="text-xs text-gray-400 ml-2">
                          {new Date(lastMessage.timestamp).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-gray-500">
                {emptyMessage}
              </div>
            )}
          </div>
        </div>

        {/* Messages panel */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow">
          {activeConversation && conversations[activeConversation]?.messages ? (
            <div className="flex flex-col h-[70vh]">
              <div className="p-4 border-b">
                <h2 className="font-semibold">
                  {conversations[activeConversation].buyer?.id === user?.uid
                    ? conversations[activeConversation].client?.username ||
                      "Client"
                    : conversations[activeConversation].buyer?.username ||
                      "Buyer"}
                </h2>
              </div>

              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
              >
                {Array.isArray(conversations[activeConversation]?.messages) &&
                  conversations[activeConversation].messages
                    .filter((msg) => msg && msg.senderId)
                    .sort((a, b) => {
                      const dateA = a?.timestamp
                        ? new Date(a.timestamp)
                        : new Date(0);
                      const dateB = b?.timestamp
                        ? new Date(b.timestamp)
                        : new Date(0);
                      return dateA - dateB;
                    })
                    .map((msg) => (
                      <div
                        key={
                          msg.id ||
                          `${msg.timestamp}-${Math.random()
                            .toString(36)
                            .substr(2, 9)}`
                        }
                        className={`flex ${
                          msg.senderId === user?.uid
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                            msg.senderId === user?.uid
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          <div className="text-sm">
                            {msg.content || "Empty message"}
                          </div>
                          <div
                            className={`text-xs mt-1 ${
                              msg.senderId === user?.uid
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {msg.timestamp
                              ? new Date(msg.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Unknown time"}
                          </div>
                        </div>
                      </div>
                    ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 p-2 border rounded-md"
                    placeholder="Type your message..."
                    disabled={!activeConversation}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    disabled={!newMessage.trim() || !activeConversation}
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">
                {Object.keys(conversations).length > 0
                  ? "Select a conversation"
                  : emptyMessage}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationsPage;
