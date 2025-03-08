// src/components/sell/Filters.js
// import React, { useState } from "react";

// const Filters = ({ onFilterChange }) => {
//   const [category, setCategory] = useState("");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   const categories = [
//     "",
//     "Products",
//     "Exchange",
//     "Done",
//     "Freelance",
//     "Transport",
//   ];

//   const handleFilterChange = () => {
//     onFilterChange({
//       category: category || null,
//       minPrice: minPrice ? parseFloat(minPrice) : null,
//       maxPrice: maxPrice ? parseFloat(maxPrice) : null,
//       searchTerm: searchTerm || null,
//     });
//   };

//   const handleClearFilters = () => {
//     setCategory("");
//     setMinPrice("");
//     setMaxPrice("");
//     setSearchTerm("");
//     onFilterChange({
//       category: null,
//       minPrice: null,
//       maxPrice: null,
//       searchTerm: null,
//     });
//   };

//   const handleBlurOrSubmit = () => {
//     handleFilterChange();
//   };

//   return (
//     <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-6">
//       <h4 className="text-xl font-bold text-gray-800 mb-4 tracking-tight">
//         Filter Listings
//       </h4>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//         {/* Category Filter */}
//         <div>
//           <label className="block text-gray-700 font-medium mb-2">
//             Category
//           </label>
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             onBlur={handleBlurOrSubmit}
//             className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-400"
//           >
//             {categories.map((cat) => (
//               <option key={cat || "all"} value={cat}>
//                 {cat || "All Categories"}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Min Price Filter */}
//         <div>
//           <label className="block text-gray-700 font-medium mb-2">
//             Min Price
//           </label>
//           <input
//             type="number"
//             value={minPrice}
//             onChange={(e) => setMinPrice(e.target.value)}
//             onBlur={handleBlurOrSubmit}
//             placeholder="e.g., 10"
//             className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-400"
//           />
//         </div>

//         {/* Max Price Filter */}
//         <div>
//           <label className="block text-gray-700 font-medium mb-2">
//             Max Price
//           </label>
//           <input
//             type="number"
//             value={maxPrice}
//             onChange={(e) => setMaxPrice(e.target.value)}
//             onBlur={handleBlurOrSubmit}
//             placeholder="e.g., 100"
//             className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-400"
//           />
//         </div>

//         {/* Search Term Filter */}
//         <div>
//           <label className="block text-gray-700 font-medium mb-2">Search</label>
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onBlur={handleBlurOrSubmit}
//             placeholder="Search by name..."
//             className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-400"
//           />
//         </div>
//       </div>
//       <div className="mt-6 flex gap-4">
//         <button
//           onClick={handleBlurOrSubmit}
//           className="flex-1 p-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200"
//         >
//           Apply Filters
//         </button>
//         <button
//           onClick={handleClearFilters}
//           className="flex-1 p-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
//         >
//           Clear Filters
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Filters;
