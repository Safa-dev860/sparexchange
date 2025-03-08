// components/DoneCard.js
import React from "react";
import { Link } from "react-router-dom";

const DoneCard = ({ item }) => {
  return (
    <Link to={`/done/${item.id}`} className="block">
      <div className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition">
        <img
          src={item.proofImages[0] || "default-image.jpg"}
          alt={item.doneTitle}
          className="w-full h-40 object-cover rounded-md"
        />
        <h2 className="text-lg font-semibold mt-2">{item.doneTitle}</h2>
        <p className="text-gray-600">by {item.owner.name}</p>
        <p className="text-blue-600 font-bold">{item.status}</p>
        {/* <p className="text-gray-400 text-sm">
          Completion:
          {item.completionDate ? item.completionDate : "Pending"}
        </p> */}
        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700">
          View Details
        </button>
      </div>
    </Link>
  );
};

export default DoneCard;
