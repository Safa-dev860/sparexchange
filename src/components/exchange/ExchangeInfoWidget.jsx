import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConversations,
  sendMessage,
} from "../../redux/slices/conversationSlice";
import {
  getDatabase,
  ref,
  onValue,
  off,
  push,
  set,
  get,
} from "firebase/database";
import { useNavigate } from "react-router-dom";
const getConversationId = (userId, productId) => `${userId}_${productId}`;

const ExchangeInfoWidget = ({ exchange, onToggleFavorite, onSendRequest }) => {
  const dispatch = useDispatch();
  const { conversations, status, error } = useSelector(
    (state) => state.conversation
  );
  const [newMessage, setNewMessage] = useState("");
  const [isConversationVisible, setIsConversationVisible] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Get the navigate function

  useEffect(() => {
    if (exchange.id && user.uid) {
      const conversationId = getConversationId(user.uid, exchange.id);
      const conversationRef = ref(
        getDatabase(),
        `products/${exchange.id}/conversations/${conversationId}`
      );

      const listener = (snapshot) => {
        const conversationData = snapshot.val();
        if (conversationData) {
          dispatch(
            fetchConversations({
              productId: exchange.id,
              conversations: { [conversationId]: conversationData },
            })
          );
          setIsConversationVisible(true);
        } else {
          // console.log(
          //   "No conversation data found for conversationId:",
          //   conversationId
          // );
        }
      };

      onValue(conversationRef, listener);

      // Cleanup function to remove the listener
      return () => off(conversationRef, "value", listener);
    }
  }, [dispatch, exchange.id, user.uid]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const conversationId = getConversationId(user.uid, exchange.id);

      dispatch(
        sendMessage({
          productId: exchange.id,
          conversationId,
          senderId: user.uid,
          receiverId: exchange.owner.id,
          message: newMessage,
        })
      );

      setNewMessage("");
    }
  };
  const onClick = () => {
    navigate(`/exchanges/${exchange.id}/edit`);
  };
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 flex flex-col w-full max-w-4xl mx-auto">
      {isConversationVisible ? (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Side: Images and Details */}
          <div className="w-full md:w-1/3 flex flex-col space-y-4">
            {/* Images */}
            <div className="w-full">
              {exchange.images.length > 0 ? (
                <div className="flex flex-col space-y-4 overflow-y-auto max-h-64 md:max-h-[calc(100vh-10rem)]">
                  {exchange.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={exchange.itemOffered}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No images available.</p>
              )}
            </div>
            {/* Details */}
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
                {exchange.location}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                <span className="font-semibold">Owner:</span>{" "}
                {exchange.owner.name} ({exchange.owner.email})
              </p>
              <p className="text-sm text-gray-500 mb-2">
                <span className="font-semibold">Status:</span> {exchange.status}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                <span className="font-semibold">Created:</span>
                {exchange.createdAt.toLocaleDateString()}
              </p>
              {user.uid !== exchange.owner.id && (
                <button
                  onClick={onToggleFavorite}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition text-2xl"
                  aria-label="Toggle Favorite"
                >
                  ❤️
                </button>
              )}
            </div>
          </div>

          {/* Right Side: Conversation */}
          <div className="w-full md:w-2/3 flex flex-col space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Conversation</h2>
            <div className="bg-gray-100 p-4 rounded-lg overflow-y-auto max-h-80">
              {Object.values(conversations).map((conversation, index) => (
                <div key={index}>
                  {Array.isArray(conversation.messages) &&
                    conversation.messages.map((message, msgIndex) => (
                      <div
                        key={msgIndex}
                        className={`mb-4 flex ${
                          message.sender === user.uid
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            message.sender === user.uid
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                </div>
              ))}
              {Object.values(conversations).length === 0 && (
                <p className="text-gray-500">No messages yet.</p>
              )}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md"
                placeholder="Type a message"
              />
              <button
                type="submit"
                className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Side: Images */}
          <div className="w-full md:w-1/3">
            {exchange.images.length > 0 ? (
              <div className="flex flex-col space-y-4 overflow-y-auto max-h-64">
                {exchange.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={exchange.itemOffered}
                    className="w-full h-48 object-cover rounded-md"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No images available.</p>
            )}
          </div>

          {/* Right Side: Details and Send Request */}
          <div className="w-full md:w-2/3 flex flex-col space-y-4">
            <h1 className="text-xl font-bold text-gray-800">
              {exchange.itemOffered}
            </h1>
            <p className="text-lg text-gray-600">
              Wants: {exchange.itemWanted}
            </p>
            <p className="text-gray-600">{exchange.description}</p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-semibold">Condition:</span>{" "}
              {exchange.condition}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-semibold">Location:</span>{" "}
              {exchange.location}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-semibold">Owner:</span>{" "}
              {exchange.owner.name} ({exchange.owner.email})
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-semibold">Status:</span> {exchange.status}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              <span className="font-semibold">Created:</span>
              {exchange.createdAt.toLocaleDateString()}
            </p>
            {user.uid !== exchange.owner.id ? (
              <>
                <button
                  onClick={onToggleFavorite}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition text-2xl"
                  aria-label="Toggle Favorite"
                >
                  ❤️
                </button>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Type your first message"
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition"
                  >
                    Send Request
                  </button>
                </form>
              </>
            ) : (
              <button
                onClick={onClick}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                Visit Your Product
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExchangeInfoWidget;
