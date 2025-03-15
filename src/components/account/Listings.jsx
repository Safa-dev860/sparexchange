import React, { useState } from "react";
import ProductAccountCard from "./ProductAccountCard";
import FreelanceAccountCard from "./FreelanceAccountCard";
import DoneAccountCard from "./DoneAccountCard";
import ExchangeAccountCard from "./ExchangeAccountCard";
import TransportAccountCard from "./TransportAccountCard";

const ListingsSection = ({
  loading,
  error,
  shopItems,
  doneItems,
  exchangeItems,
  freelanceItems,
  transportItems,
}) => {
  const categories = ["shop", "done", "exchange", "freelance", "transport"];
  const [selectedCategory, setSelectedCategory] = useState("shop");

  // Map category to corresponding items prop
  const categoryItems = {
    shop: shopItems || [],
    done: doneItems || [],
    exchange: exchangeItems || [],
    freelance: freelanceItems || [],
    transport: transportItems || [],
  };

  const displayedItems = categoryItems[selectedCategory];

  // Function to render the appropriate card based on category
  const renderCard = (item) => {
    switch (selectedCategory) {
      case "shop":
        return <ProductAccountCard key={item.id} item={item} />;
      case "done":
        return <DoneAccountCard key={item.id} item={item} />;
      case "exchange":
        return <ExchangeAccountCard key={item.id} item={item} />;
      case "freelance":
        return <FreelanceAccountCard key={item.id} item={item} />;
      case "transport":
        return <TransportAccountCard key={item.id} item={item} />;
      default:
        return null; // Fallback, though this shouldn't happen with fixed categories
    }
  };

  return (
    <div className="w-full flex flex-col p-4 rounded-xl bg-gradient-to-b from-gray-100 to-gray-50 shadow-md mt-0">
      <h3 className="text-xl font-bold text-gray-800 mb-4 tracking-tight">
        Your Listings
      </h3>
      {/* Category Navigation */}
      <div className="mb-6 w-full">
        <nav className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              className={`flex-1 min-w-[80px] px-4 py-2 rounded-lg capitalize text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white shadow-inner"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-800"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>

      {/* Listings Display */}
      {loading ? (
        <p className="text-center text-gray-600 text-lg">Loading listings...</p>
      ) : error ? (
        <p className="text-center text-red-600 text-lg">Error: {error}</p>
      ) : displayedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 w-full">
          {displayedItems.map((item) => renderCard(item))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">
          No listings available for {selectedCategory}.
        </p>
      )}
    </div>
  );
};

export default ListingsSection;
