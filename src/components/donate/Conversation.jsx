// components/widgets/ConversationWidget.js
import React from "react";
import { FaPaperPlane } from "react-icons/fa";

const ConversationWidget = ({
  conversations,
  message,
  onMessageChange,
  onSendMessage,
}) => {
  return (
    <div className="w-full flex flex-col bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 tracking-tight">
        Conversations
      </h3>
      <div className="flex-1 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {conversations.length > 0 ? (
          conversations.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-3 ${
                msg.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg shadow-sm ${
                  msg.sender === "You"
                    ? "bg-indigo-100 text-gray-800"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <p>{msg.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No conversations yet.</p>
        )}
      </div>
      <form onSubmit={onSendMessage} className="flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-400"
        />
        <button
          type="submit"
          className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default ConversationWidget;
