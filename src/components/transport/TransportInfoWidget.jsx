// components/TransportInfoWidget.jsx
import React from "react";

const TransportInfoWidget = ({
  transport,
  onToggleFavorite,
  onBookTransport,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 flex flex-col md:flex-row">
      {/* Left Column: Images (stacked on mobile, side on md+) */}
      <div className="w-full md:w-1/3 md:pr-4 mb-4 md:mb-0">
        {transport.images.length > 0 ? (
          <div className="flex flex-col space-y-4 overflow-y-auto max-h-[calc(100vh-10rem)] sm:max-h-[calc(100vh-12rem)]">
            {transport.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={transport.vehicleType}
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
          {transport.vehicleType}
        </h1>
        <p className="text-lg sm:text-xl text-green-600 mb-4">
          ${transport.price}
        </p>
        <p className="text-gray-600 mb-4">Route: {transport.route}</p>
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-semibold">Capacity:</span> {transport.capacity}
        </p>
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-semibold">Owner:</span> {transport.owner.name} (
          {transport.owner.email})
        </p>
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-semibold">Status:</span> {transport.status}
        </p>
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-semibold">Created:</span>{" "}
          {transport.createdAt.toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          <span className="font-semibold">Active Until:</span>{" "}
          {transport.activeUntil
            ? transport.activeUntil.toLocaleDateString()
            : "N/A"}
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
            onClick={onBookTransport}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Book Transport
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransportInfoWidget;
