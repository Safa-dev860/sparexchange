// components/account/FreelanceForm.js
import React from "react";
import PropTypes from "prop-types";
import PackageModal from "./PackageModal";
import { useState } from "react";
const FreelanceForm = ({
  formData,
  handleFormChange,
  handleSubmit,
  handleAddPackage,
  isLoading,
  uploadError,
}) => {
  // Ensure formData.packages is an array
  if (!Array.isArray(formData.packages)) {
    formData.packages = [];
  }

  const [isPackageModalOpen, setPackageModalOpen] = useState(false);

  const handleOpenPackageModal = () => {
    setPackageModalOpen(true);
  };

  const handleClosePackageModal = () => {
    setPackageModalOpen(false);
  };

  const handleAddPackageFromModal = (packageData) => {
    handleAddPackage(packageData);
  };

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

        {/* Dynamic Package Fields */}
        {formData.packages.map((packageItem, index) => (
          <div key={index} className="mb-5">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Package {index + 1}
            </h3>
            <div className="mb-3">
              <label className="block text-gray-700 font-medium mb-2">
                Package Title
              </label>
              <input
                type="text"
                name={`packages[${index}].title`}
                value={packageItem.title}
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
            <div className="mb-3">
              <label className="block text-gray-700 font-medium mb-2">
                Package Description
              </label>
              <textarea
                name={`packages[${index}].description`}
                value={packageItem.description}
                onChange={handleFormChange}
                className={`w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-indigo-400"
                }`}
                rows="2"
                disabled={isLoading}
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 font-medium mb-2">
                Package Price
              </label>
              <input
                type="number"
                name={`packages[${index}].price`}
                value={packageItem.price}
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
            <div className="mb-3">
              <label className="block text-gray-700 font-medium mb-2">
                Package Delivery Time (days)
              </label>
              <input
                type="number"
                name={`packages[${index}].deliveryTime`}
                value={packageItem.deliveryTime}
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
            <div className="mb-3">
              <label className="block text-gray-700 font-medium mb-2">
                Package Revisions
              </label>
              <input
                type="number"
                value={packageItem.revisions}
                onChange={handleFormChange}
                className={`w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-indigo-400"
                }`}
                disabled={isLoading}
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleOpenPackageModal}
          disabled={isLoading}
          className={`w-full p-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Add Package
        </button>

        <PackageModal
          isOpen={isPackageModalOpen}
          onClose={handleClosePackageModal}
          onAddPackage={handleAddPackageFromModal}
          isLoading={isLoading}
          uploadError={uploadError}
        />

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
  handleAddPackage: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  uploadError: PropTypes.string,
};

export default FreelanceForm;
