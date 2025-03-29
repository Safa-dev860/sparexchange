import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { exchangeThunks } from "../../redux/slices/categorySlice";

const ExchangeAccountCard = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    dispatch(exchangeThunks.deleteItem(item.id))
      .unwrap()
      .then(() => {
        console.log(`Exchange ${item.id} deleted successfully`);
        setShowConfirm(false);
      })
      .catch((error) => {
        console.error("Failed to delete exchange:", error);
      });
  };

  return (
    <>
      <div className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition relative group">
        <img
          src={item.images[0] || "default-image.jpg"}
          alt={item.itemOffered}
          className="w-full h-40 object-cover rounded-md"
        />
        <h2 className="text-lg font-semibold mt-2">{item.itemOffered}</h2>
        <p className="text-gray-600">by {item.owner.name}</p>
        <p className="text-green-600 font-bold">
          Wanted: {item.itemWanted || "Open to offers"}
        </p>
        <p className="text-gray-400 text-sm">Condition: {item.condition}</p>

        {/* Hover overlay with icon buttons */}
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center gap-4">
          <button
            className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/exchanges/${item.id}/edit`);
            }}
            title="Edit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>

          {/* New Conversation Icon */}
          <button
            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/exchanges/${item.id}/conversations`);
            }}
            title="Conversations"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>

          <button
            className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition"
            onClick={(e) => {
              e.preventDefault();
              setShowConfirm(true);
            }}
            title="Delete"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a2 2 0 00-2 2h8a2 2 0 00-2-2m-4 0V3m-3 4h10"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete "{item.itemOffered}"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExchangeAccountCard;
