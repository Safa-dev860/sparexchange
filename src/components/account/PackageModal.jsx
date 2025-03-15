// components/account/PackageModal.js
import React from "react";
import PropTypes from "prop-types";

const PackageModal = ({
  isOpen,
  onClose,
  onAddPackage,
  isLoading,
  uploadError,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Add New Package</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Package Title
            </label>
            <input
              type="text"
              name="title"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Package Description
            </label>
            <textarea
              name="description"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              rows="4"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Package Price
            </label>
            <input
              type="number"
              name="price"
              step="0.01"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Package Delivery Time (days)
            </label>
            <input
              type="number"
              name="deliveryTime"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Package Revisions
            </label>
            <input
              type="number"
              name="revisions"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 p-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => {
                const form = e.target.form;
                const packageData = {
                  title: form.title.value,
                  description: form.description.value,
                  price: parseFloat(form.price.value),
                  deliveryTime: parseInt(form.deliveryTime.value, 10),
                  revisions: parseInt(form.revisions.value, 10),
                };
                onAddPackage(packageData);
                form.reset();
                onClose();
              }}
              className="p-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              Add Package
            </button>
          </div>
        </form>
        {uploadError && (
          <p className="text-red-500 mt-3 text-sm">{uploadError}</p>
        )}
      </div>
    </div>
  );
};

PackageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddPackage: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  uploadError: PropTypes.string,
};

export default PackageModal;
