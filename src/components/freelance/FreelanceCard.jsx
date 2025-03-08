// components/FreelanceCard.js
import React from "react";
import { Link } from "react-router-dom";

const FreelanceCard = ({ item }) => {
  // const basicPackage =
  //   item.packages.find((pkg) => pkg.title.toLowerCase() === "basic") ||
  //   item.packages[0];
  return (
    <Link to={`/gigs/${item.id}`} className="block">
      <div className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition">
        <img
          src={item.images[0] || "default-image.jpg"}
          alt={item.gigTitle}
          className="w-full h-40 object-cover rounded-md"
        />
        <h2 className="text-lg font-semibold mt-2">{item.gigTitle}</h2>
        <p className="text-gray-600">by {item.freelancer.name}</p>
        {/* <p className="text-blue-600 font-bold">${basicPackage.price}</p>
        <p className="text-gray-400 text-sm">
          Delivery: {basicPackage.deliveryTime} days
        </p> */}
        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700">
          Hire Now
        </button>
      </div>
    </Link>
  );
};

export default FreelanceCard;
