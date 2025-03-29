import React, { useEffect, useRef } from "react";

const ConversationView = ({ conversation, currentUserId, status }) => {
  const messagesContainerRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }, [conversation?.messages]);
  if (status === "loading") {
    return (
      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 flex flex-col w-full max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }
  if (!conversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p className="text-sm">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  if (conversation.messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No messages yet. Start the conversation!
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Empty div that pushes messages to bottom */}
      <div className="flex-1" />

      {/* Messages container with reverse flex to keep new messages at bottom */}
      <div
        ref={messagesContainerRef}
        className="overflow-y-auto p-4 space-y-4 flex flex-col"
      >
        {Array.isArray(conversation?.messages) &&
          conversation.messages
            .filter((msg) => msg && msg.senderId)
            .sort((a, b) => {
              const dateA = a?.timestamp ? new Date(a.timestamp) : new Date(0);
              const dateB = b?.timestamp ? new Date(b.timestamp) : new Date(0);
              return dateA - dateB;
            })
            .map((msg) => (
              <div
                key={
                  msg.id ||
                  `${msg.timestamp}-${Math.random().toString(36).substr(2, 9)}`
                }
                className={`flex ${
                  msg.senderId === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                    msg.senderId === currentUserId
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <div className="text-sm">
                    {msg.content || "Empty message"}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      msg.senderId === currentUserId
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
    </div>
  );
};

export default ConversationView;
