import React from "react";

const Analytics = ({ analyticsData }) => {
  return (
    <div className="bg-blue-100 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Analytics</h2>
      <div className="space-y-4">
        {analyticsData.map((data, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md"
          >
            <p className="text-gray-900 font-medium">{data.metric}</p>
            <p className="text-gray-900 font-bold">{data.value}%</p>
            <p
              className={
                data.trend.startsWith("+") ? "text-green-500" : "text-red-500"
              }
            >
              {data.trend}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
