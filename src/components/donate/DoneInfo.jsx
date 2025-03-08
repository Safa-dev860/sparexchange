// components/widgets/DoneInfoWidget.js
import React from "react";
import { FaHeart } from "react-icons/fa";

const DoneInfo = ({ done, onToggleFavorite, onSendRequest }) => {
  return (
    <div className="w-full flex flex-col md:flex-row bg-white rounded-xl shadow-lg p-6 gap-6">
      {/* Images Gallery (Left on desktop, Top on mobile) */}
      <div className="md:w-1/2 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-4 tracking-tight">
          Proof Images
        </h3>
        {done.proofImages.length > 0 ? (
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
      </div>

      {/* Details and Buttons (Right on desktop, Bottom on mobile) */}
      <div className="md:w-1/2 flex flex-col">
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
            {done.status.charAt(0).toUpperCase() + done.status.slice(1)}
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
        <div className="mt-6 flex gap-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite();
            }}
            className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center"
          >
            <FaHeart />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onSendRequest();
            }}
            className="flex-1 p-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200"
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoneInfo;
