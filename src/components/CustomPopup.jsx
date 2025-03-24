import React from "react";

const CustomPopup = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmText,
  cancelText,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-11/12 max-w-md">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>

        {/* Message */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
            >
              {confirmText || "Confirm"}
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
          >
            {cancelText || "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomPopup;
