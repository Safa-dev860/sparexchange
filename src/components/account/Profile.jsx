// src/components/Account/ProfileSection.jsx
import React from "react";

const ProfileSection = ({ user }) => {
  return (
    <div className="w-full bg-white shadow-lg p-4 rounded-xl mt-0 ">
      <img
        src={user.photoURL || "https://picsum.photos/150"}
        alt="Profile"
        className="w-28 h-28 rounded-full mb-4 mx-auto border-2 border-gray-200"
      />
      <h2 className="text-2xl font-bold text-gray-800 text-center tracking-tight">
        {user.displayName}
      </h2>
      <p className="text-gray-600 text-center text-sm mt-1">{user.email}</p>
    </div>
  );
};

export default ProfileSection;
