// components/account/FreelanceForm.js
import React from "react";
import PropTypes from "prop-types";

const FreelanceForm = ({
  formData,
  handleFormChange,
  handleSubmit,
  isLoading,
  uploadError,
}) => {
  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-lg mt-0">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">
        Add New Freelance Gig
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">
            Gig Title
          </label>
          <input
            type="text"
            name="gigTitle"
            value={formData.gigTitle}
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
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleFormChange}
            className={`w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-indigo-400"
            }`}
            disabled={isLoading}
          />
        </div>
        {/* Basic Package Fields */}
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">
            Basic Package Price
          </label>
          <input
            type="number"
            name="packages[0].price"
            value={formData.packages?.[0]?.price || ""}
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
            Basic Package Delivery Time (days)
          </label>
          <input
            type="number"
            name="packages[0].deliveryTime"
            value={formData.packages?.[0]?.deliveryTime || ""}
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
          {isLoading ? "Adding..." : "Add Gig"}
        </button>
        {uploadError && (
          <p className="text-red-500 mt-3 text-sm">{uploadError}</p>
        )}
      </form>
    </div>
  );
};

FreelanceForm.propTypes = {
  formData: PropTypes.object.isRequired,
  handleFormChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  uploadError: PropTypes.string,
};

export default FreelanceForm;
