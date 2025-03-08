// components/ExchangeInfoWidget.jsx
import React from "react";

const ExchangeInfoWidget = ({ exchange, onToggleFavorite, onSendRequest }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 flex flex-col md:flex-row">
      {/* Left Column: Images (stacked on mobile, side on md+) */}
      <div className="w-full md:w-1/3 md:pr-4 mb-4 md:mb-0">
        {exchange.images.length > 0 ? (
          <div className="flex flex-col space-y-4 overflow-y-auto max-h-[calc(100vh-10rem)] sm:max-h-[calc(100vh-12rem)]">
            {exchange.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={exchange.itemOffered}
                className="w-full h-48 sm:h-64 object-cover rounded-md"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No images available.</p>
        )}
      </div>

      {/* Right Column: Details (below images on mobile, side on md+) */}
      <div className="w-full md:w-2/3 md:pl-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          {exchange.itemOffered}
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-4">
          Wants: {exchange.itemWanted}
        </p>
        <p className="text-gray-600 mb-4">{exchange.description}</p>
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-semibold">Condition:</span> {exchange.condition}
        </p>
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-semibold">Location:</span> {exchange.location}
        </p>
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-semibold">Owner:</span> {exchange.owner.name} (
          {exchange.owner.email})
        </p>
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-semibold">Status:</span> {exchange.status}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          <span className="font-semibold">Created:</span>{" "}
          {exchange.createdAt.toLocaleDateString()}
        </p>
        <div className="flex space-x-4">
          <button
            onClick={onToggleFavorite}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition text-2xl"
            aria-label="Toggle Favorite"
          >
            ❤️ {/* Unicode heart */}
          </button>
          <button
            onClick={onSendRequest}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExchangeInfoWidget;
