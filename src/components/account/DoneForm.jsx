// components/account/DoneForm.js
import React from "react";
import PropTypes from "prop-types";

const DoneForm = ({
  formData,
  handleFormChange,
  handleSubmit,
  isLoading,
  uploadError,
}) => {
  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-lg mt-0">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">
        Add New Done Task
      </h2>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">
            Task Title
          </label>
          <input
            type="text"
            name="doneTitle"
            value={formData.doneTitle}
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
            Completion Date
          </label>
          <input
            type="date"
            name="completionDate"
            value={
              formData.completionDate instanceof Date
                ? formData.completionDate.toISOString().split("T")[0]
                : formData.completionDate || ""
            }
            onChange={handleFormChange}
            className={`w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-indigo-400"
            }`}
            disabled={isLoading}
          />
        </div>
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">
            Remarks
          </label>
          <textarea
            name="remarks"
            value={formData.remarks}
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
            Proof Images
          </label>
          <input
            type="file"
            name="proofImages"
            onChange={handleFormChange}
            multiple
            className={`w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-100 file:text-indigo-700 file:font-semibold hover:file:bg-indigo-200 transition-all duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          />
          {formData.proofImages.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {formData.proofImages.length} file(s) selected
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
          {isLoading ? "Adding..." : "Add Task"}
        </button>
        {uploadError && (
          <p className="text-red-500 mt-3 text-sm">{uploadError}</p>
        )}
      </form>
    </div>
  );
};

DoneForm.propTypes = {
  formData: PropTypes.object.isRequired,
  handleFormChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  uploadError: PropTypes.string,
};

export default DoneForm;
