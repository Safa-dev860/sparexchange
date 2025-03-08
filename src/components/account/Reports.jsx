import React from "react";

const Reports = ({ reportsData }) => {
  return (
    <div className="bg-blue-100 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Reports</h2>
      <div className="space-y-4">
        {reportsData.map((report, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md"
          >
            <p className="text-gray-900 font-medium">{report.report}</p>
            <p className="text-gray-600">{report.date}</p>
            <p
              className={
                report.status === "Completed"
                  ? "text-green-500"
                  : "text-yellow-500"
              }
            >
              {report.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
