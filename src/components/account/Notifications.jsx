import React from "react";

const Notifications = ({ notificationsData }) => {
  return (
    <div className="bg-blue-100 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      <div className="space-y-4">
        {notificationsData.map((notification, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-md">
            <p className="text-gray-900">{notification.message}</p>
            <p className="text-gray-600 text-sm mt-2">{notification.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
