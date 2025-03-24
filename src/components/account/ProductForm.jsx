import React, { useState } from "react";
import PropTypes from "prop-types";
import LocationPicker from "../LocationPicker";

const initialFormData = {
  name: "",
  price: "",
  description: "",
  category: "",
  location: null, // Changed to match ExchangeForm's structure
  images: [],
};

// Predefined categories
const categories = ["Plastic", "Paper", "Glass", "Metal", "Electronics"];

const ProductForm = ({
  formData = initialFormData,
  handleFormChange,
  handleSubmit,
  isLoading,
  uploadError,
}) => {
  const [showMap, setShowMap] = useState(false);

  // Handle location selection
  const handleLocationSelect = (location) => {
    handleFormChange({
      target: {
        name: "location",
        value: location,
      },
    });
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
            className={`w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-green-400"
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
            className={`w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-green-400"
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
            className={`w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
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
            className={`w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-green-400"
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
                : "hover:border-green-400"
            }`}
            disabled={isLoading}
          >
            {formData.location?.city
              ? formData.location.city
              : "Select a Location"}
          </button>
          {showMap && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg w-11/12 max-w-2xl">
                <LocationPicker
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
          className={`w-full p-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 ${
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

ProductForm.propTypes = {
  formData: PropTypes.object.isRequired,
  handleFormChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  uploadError: PropTypes.string,
};

export default ProductForm;
