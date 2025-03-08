// components/DoneDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { doneThunks } from "../../redux/slices/categorySlice"; // Adjust path to your thunks
import DoneInfo from "./DoneInfo";
import Conversation from "./Conversation";

const DoneRequest = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Select from state.done, matching your Donate page
  const doneItems = useSelector((state) => state.done.items) || [];
  const loading = useSelector((state) => state.done.loading) || false;
  const error = useSelector((state) => state.done.error) || null;

  const [done, setDone] = useState(null);
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const foundDone = doneItems.find((item) => item.id === id);
    if (foundDone) {
      setDone(foundDone);
      setConversations(foundDone.conversations || []);
    } else if (!loading && !error) {
      dispatch(doneThunks.fetchItems())
        .unwrap()
        .then(() => {
          const refreshedDone = doneItems.find((item) => item.id === id);
          if (refreshedDone) {
            setDone(refreshedDone);
            setConversations(refreshedDone.conversations || []);
          } else {
            console.error(`Item with id ${id} not found after fetch`);
          }
        })
        .catch((err) => console.error("Failed to fetch done items:", err));
    }
  }, [id, doneItems, dispatch, loading, error]);

  const handleAddToFavorites = () => {
    alert(`${done?.doneTitle} added to favorites!`);
    // dispatch(addToFavorites(done.id));
  };

  const handleAddToCart = () => {
    alert(`${done?.doneTitle} added to cart!`);
    // dispatch(addToCart(done.id));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        text: message,
        sender: "You",
        timestamp: new Date(),
      };
      setConversations([...conversations, newMessage]);
      setMessage("");
      // dispatch(saveMessage({ doneId: id, message: newMessage }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 justify-center items-center">
        <p className="text-center text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 justify-center items-center">
        <p className="text-center text-red-600 text-lg">
          Error: {error.message || "Failed to load details."}
        </p>
      </div>
    );
  }

  if (!done) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 justify-center items-center">
        <p className="text-center text-gray-600 text-lg">
          No details found for this item.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="w-4/5 mx-auto flex flex-row p-6 gap-6 flex-1">
        <div className="w-1/3">
          <DoneInfo
            done={done}
            onAddToFavorites={handleAddToFavorites}
            onAddToCart={handleAddToCart}
          />
        </div>
        <div className="w-2/3">
          <Conversation
            conversations={conversations}
            message={message}
            onMessageChange={setMessage}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default DoneRequest;
