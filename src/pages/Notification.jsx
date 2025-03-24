import React from "react";

const Notification = () => {
  return (
    <div className=" mt-24 mb-24">
      <div className="notification-container">
        <div className="notification-list">
          <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-400"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-700">
                Coming Soon!
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                This feature is currently under development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
