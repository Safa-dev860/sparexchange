import React from "react";

const Statistique = () => {
  return (
    <div className="w-full bg-white shadow-lg p-4 rounded-xl mt-0">
      <h3 className="text-xl font-bold text-gray-800 mb-4 tracking-tight">
        Statistique
      </h3>
      <ul className="w-full">
        <li className="p-3 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
          <div className="flex items-center">
            <img
              src="https://picsum.photos/50"
              alt="Avatar"
              className="w-12 h-12 rounded-full mr-4 border border-gray-200"
            />
            <div>
              <p className="font-semibold text-gray-800">John Doe</p>
              <p className="text-sm text-gray-600">New listing added</p>
            </div>
          </div>
          <button
            className="w-8 h-8 bg-gray-200 rounded-full flex justify-center items-center hover:bg-gray-300 transition-colors duration-200"
            onClick={() => alert("Show actions for Notification 1")}
          >
            <span className="text-lg text-gray-600">•••</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Statistique;
