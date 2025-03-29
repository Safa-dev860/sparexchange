// src/components/Account/ProfileSection.jsx
import React from "react";

const ProfileSection = ({ user }) => {
  return (
    <div className="w-full bg-white shadow-lg p-6 rounded-xl mt-0 transition-all hover:shadow-xl">
      {/* Profile Picture */}
      <img
        src={user.profilePicture}
        alt="Profile"
        className="w-32 h-32 rounded-full mb-6 mx-auto border-4 border-green-700 hover:border-green-700 transition-all"
      />

      {/* User Name */}
      <h2 className="text-3xl font-bold text-gray-800 text-center tracking-tight mb-2">
        {user.name}
      </h2>

      {/* User Balance */}
      <div className="bg-green-50 p-3 rounded-lg text-center mb-4">
        <span className="text-lg font-semibold text-green-800">
          Balance: {user.balance} DT
        </span>
      </div>

      {/* User Email */}
      <p className="text-gray-600 text-center text-sm mt-2">{user.email}</p>
    </div>
  );
};

export default ProfileSection;
