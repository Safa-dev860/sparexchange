import React, { useState } from "react";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet"; // Import Leaflet for custom icon
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

// Define the SVG marker icon
const svgIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
    <path fill="#FF0000" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
`;

// Create a Leaflet icon from the SVG
const customMarkerIcon = L.divIcon({
  html: svgIcon,
  iconSize: [36, 36], // Size of the SVG
  iconAnchor: [18, 36], // Anchor point (bottom center of the pin)
  className: "", // Remove default Leaflet class to avoid styling conflicts
});

const initialFormData = {
  name: "",
  price: "",
  description: "",
  category: "",
  location: { lat: 33.8869, lng: 9.5375 }, // Default to Tunisia's coordinates
  images: [],
};

const ProductForm = ({
  formData = initialFormData,
  handleFormChange,
  handleSubmit,
  isLoading,
  uploadError,
}) => {
  const [showMap, setShowMap] = useState(false);

  // Predefined categories
  const categories = ["Plastic", "Paper", "Glass", "Metal", "Electronics"];

  // Handle location selection
  const handleLocationSelect = (lat, lng) => {
    handleFormChange({
      target: {
        name: "location",
        value: { lat, lng },
      },
    });
    setShowMap(false);
  };

  return (
    <div className="w-full bg-white p-6 figure rounded-xl shadow-lg mt-0">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">
        Add New Product
      </h2>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            className={`w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-indigo-400"
            }`}
            disabled={isLoading}
            required
          />
        </div>
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleFormChange}
            step="0.01"
            className={`w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-indigo-400"
            }`}
            disabled={isLoading}
            required
          />
        </div>
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            className={`w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-indigo-400"
            }`}
            rows="4"
            disabled={isLoading}
          />
        </div>
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleFormChange}
            className={`w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-indigo-400"
            }`}
            disabled={isLoading}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">
            Location
          </label>
          <button
            type="button"
            onClick={() => setShowMap(true)}
            className={`w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 text-left ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-indigo-400"
            }`}
            disabled={isLoading}
          >
            {formData.location?.lat && formData.location?.lng
              ? `Lat: ${formData.location.lat.toFixed(
                  4
                )}, Lng: ${formData.location.lng.toFixed(4)}`
              : "Select Location"}
          </button>
          {showMap && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg w-11/12 max-w-2xl">
                <TunisiaMap
                  initialLocation={formData.location}
                  onSelect={handleLocationSelect}
                  onClose={() => setShowMap(false)}
                />
              </div>
            </div>
          )}
        </div>
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">Images</label>
          <input
            type="file"
            name="images"
            onChange={handleFormChange}
            multiple
            className={`w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-100 file:text-indigo-700 file:font-semibold hover:file:bg-indigo-200 transition-all duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          />
          {formData.images.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {formData.images.length} file(s) selected
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Adding..." : "Add Product"}
        </button>
        {uploadError && (
          <p className="text-red-500 mt-3 text-sm">{uploadError}</p>
        )}
      </form>
    </div>
  );
};

// Tunisia Map component with SVG marker and buttons in a row
const TunisiaMap = ({ initialLocation, onSelect, onClose }) => {
  const [selectedLocation] = useState(
    initialLocation.lat && initialLocation.lng
      ? [initialLocation.lat, initialLocation.lng]
      : null
  );

  // Component to handle map click events
  const MapClickHandler = () => {
    // const map = useMapEvents({
    //   click(e) {
    //     const { lat, lng } = e.latlng;
    //     setSelectedLocation([lat, lng]);
    //   },
    // });
    return null;
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelect(selectedLocation[0], selectedLocation[1]);
    }
  };

  return (
    <div>
      <MapContainer
        center={[33.8869, 9.5375]} // Center on Tunisia
        zoom={6} // Zoom level to show all of Tunisia
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        {selectedLocation && (
          <Marker position={selectedLocation} icon={customMarkerIcon} />
        )}
      </MapContainer>
      <div className="mt-4 flex justify-center space-x-4">
        <button
          type="button"
          onClick={handleConfirm}
          className="p-2 bg-green-500 text-white rounded-lg"
          disabled={!selectedLocation} // Disable if no location is selected
        >
          Confirm Location
        </button>
        <button
          type="button"
          onClick={onClose}
          className="p-2 bg-red-500 text-white rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

ProductForm.propTypes = {
  formData: PropTypes.object.isRequired,
  handleFormChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  uploadError: PropTypes.string,
};

export default ProductForm;
