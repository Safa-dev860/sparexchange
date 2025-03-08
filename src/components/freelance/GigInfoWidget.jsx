// components/widgets/GigInfoWidget.js
import React from "react";
import { FaHeart } from "react-icons/fa";

const GigInfoWidget = ({ gig, onToggleFavorite, onSendRequest }) => {
  let packages = [];
  if (gig.packages instanceof Map) {
    packages = Array.from(gig.packages.entries()).map(([title, details]) => ({
      title,
      ...Object.fromEntries(details), // Convert inner Map to object
    }));
  } else if (Array.isArray(gig.packages)) {
    packages = gig.packages; // Use as-is if already an array
  } else {
    packages = []; // Fallback to empty array if neither
  }
  return (
    <div className="w-full flex flex-col md:flex-row bg-white rounded-xl shadow-lg p-6 gap-6">
      {/* Images Gallery (Left on desktop, Top on mobile) */}
      <div className="md:w-1/2 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-4 tracking-tight">
          Gig Images
        </h3>
        {gig.images.length > 0 ? (
          <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {gig.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={image}
                className="w-32 h-32 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-200 flex-shrink-0"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No images available.</p>
        )}
      </div>

      {/* Details and Buttons (Right on desktop, Bottom on mobile) */}
      <div className="md:w-1/2 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 tracking-tight">
          {gig.gigTitle}
        </h2>
        <div className="space-y-3 text-gray-700 flex-1">
          <p>
            <span className="font-semibold">Freelancer:</span>{" "}
            {gig.freelancer.name || "Anonymous"}
          </p>
          <p>
            <span className="font-semibold">Category:</span>{" "}
            {gig.category || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
          </p>
          <p>
            <span className="font-semibold">Description:</span>{" "}
            {gig.description || "No description provided."}
          </p>
          <p>
            <span className="font-semibold">Technologies:</span>{" "}
            {gig.technologies.length > 0 ? gig.technologies.join(", ") : "None"}
          </p>
          <p>
            <span className="font-semibold">Created:</span>{" "}
            {new Date(gig.createdAt).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Updated:</span>{" "}
            {new Date(gig.updatedAt).toLocaleString()}
          </p>
          <div>
            <span className="font-semibold">Packages:</span>
            {packages.map((pkg, index) => (
              <div key={index} className="mt-2 pl-4">
                <p className="font-medium capitalize">{pkg.title}</p>
                <p className="text-sm">
                  {pkg.description || "No description"} - ${pkg.price} -{" "}
                  {pkg.revisions} Revisions - {pkg.deliveryTime} Days
                </p>
              </div>
            ))}
          </div>
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
            Hire Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default GigInfoWidget;
