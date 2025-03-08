import React from "react";

const UnauthorizedAccess = () => {
  return (
    <div className="unauthorized-access flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to access this page. Please log in or
          contact support if you believe this is an error.
        </p>
        {/* Optional: Add a link to login or go back */}
        <div>
          <a href="/login" className="text-blue-500 hover:underline">
            Go to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
