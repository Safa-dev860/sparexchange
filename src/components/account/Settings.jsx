import React from "react";
const Settings = ({ handleLogout }) => {
  return (
    <div className="w-full bg-white shadow-md p-4 mt-8 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Settings</h3>
      <button className="w-full p-2 bg-blue-500 text-white rounded-md mb-2">
        Change Password
      </button>
      <button
        onClick={handleLogout}
        className="w-full p-2 bg-red-500 text-white rounded-md"
      >
        Logout
      </button>
    </div>
  );
};

export default Settings;
