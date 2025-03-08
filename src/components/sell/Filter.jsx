// src/components/sell/Filters.js
import React from "react";
import { FaFilter } from "react-icons/fa"; // Importing filter icon from react-icons

const Filters = ({
  search,
  setSearch,
  category,
  setCategory,
  sortBy,
  setSortBy,
}) => {
  const handleApplyFilters = () => {
    // Optional: Trigger any additional logic if needed
    setSearch(search); // These updates are redundant since onChange already sets state,
    setCategory(category); // but kept for clarity if you add manual apply logic
    setSortBy(sortBy);
  };

  return (
    <div className="bg-white p-2 sm:p-4 rounded-xl shadow-lg my-2">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Filter Logo/Icon */}
        <div className="flex-shrink-0">
          <FaFilter className="text-indigo-600 text-xl" />
        </div>

        {/* Search Filter */}
        <div className="w-full sm:w-auto flex-1">
          <input
            type="text"
            placeholder="Search items by name..."
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-auto flex-1">
          <select
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-400"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Plastic">Plastic</option>
            <option value="Paper">Paper</option>
            <option value="Glass">Glass</option>
            <option value="Metal">Metal</option>
            <option value="Electronics">Electronics</option>
          </select>
        </div>

        {/* Sort By Filter */}
        <div className="w-full sm:w-auto flex-1">
          <select
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-400"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Default Sorting</option>
            <option value="price">Price (Low to High)</option>
            <option value="date">Newest First</option>
          </select>
        </div>

        {/* Apply Filters Button */}
        <div className="w-full sm:w-auto">
          <button
            onClick={handleApplyFilters}
            className="w-full sm:w-auto p-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
