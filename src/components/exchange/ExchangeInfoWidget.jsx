import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  startNewConversation,
  fetchOneConversation,
  sendMessage,
} from "../../redux/slices/conversationSlice";
import ConversationView from "./ConversationView";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";

const ExchangeInfoWidget = ({ exchange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { conversations, status } = useSelector((state) => state.conversation);
  const [newMessage, setNewMessage] = useState("");
  const [existingConversationId, setExistingConversationId] = useState(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const messagesContainerRef = useRef(null);
  // Check if current user is the product owner
  const isOwner = user?.uid === exchange?.owner?.id;

  // Check for existing conversation
  useEffect(() => {
    const checkExistingConversation = async () => {
      if (!user?.uid || !exchange?.id || isOwner) {
        setIsLoadingConversation(false);
        return;
      }

      const firestore = getFirestore();
      const q = query(
        collection(firestore, "Conversations"),
        where("productId", "==", exchange.id),
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
              productId: exchange.id,
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
  }, [dispatch, exchange.id, user?.uid, isOwner]);

  // Set up real-time listener for conversation updates
  useEffect(() => {
    if (!existingConversationId || !exchange?.id) return;

    const db = getDatabase();
    const conversationRef = ref(
      db,
      `products/${exchange.id}/conversations/${existingConversationId}`
    );

    const unsubscribe = onValue(conversationRef, (snapshot) => {
      if (snapshot.exists()) {
        dispatch(
          fetchOneConversation({
            productId: exchange.id,
            conversationId: existingConversationId,
            conversationData: snapshot.val(),
          })
        );
      }
    });

    return () => unsubscribe();
  }, [existingConversationId, exchange?.id, dispatch]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [conversations, existingConversationId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isOwner) return;

    if (existingConversationId) {
      dispatch(
        sendMessage({
          productId: exchange.id,
          conversationId: existingConversationId,
          senderId: user.uid,
          message: newMessage,
          clientId: exchange.owner.id,
          buyerId: user.uid,
        })
      );
    } else {
      dispatch(
        startNewConversation({
          productId: exchange.id,
          client: {
            username: exchange.owner.name,
            id: exchange.owner.id,
            profileUrl: exchange.owner.imageUrl,
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

  const handleEditProduct = () => {
    navigate(`/exchanges/${exchange.id}/edit`);
  };

  if (isLoadingConversation) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
        <p className="ml-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  const currentConversation = existingConversationId
    ? conversations[existingConversationId]
    : null;

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 flex flex-col w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Side: Product Details */}
        <div className="w-full md:w-1/3">
          <div className="mb-4">
            {exchange.images?.length > 0 && (
              <img
                src={exchange.images[0]}
                alt={exchange.itemOffered}
                className="w-full h-48 object-cover rounded-md"
              />
            )}
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              {exchange.itemOffered}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Wants: {exchange.itemWanted}
            </p>
            <p className="text-gray-600 mb-4">{exchange.description}</p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-semibold">Condition:</span>{" "}
              {exchange.condition}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-semibold">Location:</span>{" "}
              {exchange.location?.city || exchange.location}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-semibold">Owner:</span>{" "}
              {exchange.owner?.name} ({exchange.owner?.email})
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-semibold">Status:</span> {exchange.status}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              <span className="font-semibold">Created:</span>{" "}
              {new Date(exchange.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Right Side: Conversation (only for non-owners) */}
        {!isOwner ? (
          <div className="w-full md:w-2/3 flex flex-col border rounded-lg h-[70vh]">
            <div className="border-b p-4 flex flex-row items-center gap-2 sticky top-0 bg-white z-10">
              <img
                src={exchange?.owner?.imageUrl}
                alt="Client"
                className="w-10 h-10 rounded-full object-cover"
              />
              <h1>{exchange?.owner?.name}</h1>
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  disabled={!newMessage.trim()}
                >
                  {currentConversation ? "Send" : "Start Chat"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="w-full md:w-2/3 flex items-center justify-center">
            <div className="text-center p-8">
              <h3 className="text-lg font-medium mb-2">This is your product</h3>
              <p className="text-gray-600 mb-4">
                You can edit the product details or wait for others to contact
                you.
              </p>
              <button
                onClick={handleEditProduct}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
              >
                Edit Product Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExchangeInfoWidget;
