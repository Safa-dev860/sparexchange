// import React, { useState } from "react";

// const ProductDetail = () => {
//   const [quantity, setQuantity] = useState(1);

//   const handleQuantityChange = (e) => {
//     const value = parseInt(e.target.value);
//     setQuantity(value < 1 ? 1 : value);
//   };

//   return (
//     <div className="max-w-4xl my-8 mx-auto p-6 bg-white shadow-md rounded-lg">
//       {/* Product Image and Details Layout */}
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Product Image */}
//         <div className="w-full md:w-1/2">
//           <img
//             src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV3xF-Qj9JdR4PuY2qYgHfPGiyrWsF_qfWiQ&s"
//             alt="BigCommerce Mug"
//             className="w-full h-auto rounded-lg shadow-md"
//           />
//         </div>

//         {/* Product Details */}
//         <div className="w-full md:w-1/2">
//           {/* Product Title */}
//           <h1 className="text-2xl font-bold mb-2">BigCommerce Mug</h1>
//           <p className="text-gray-600 mb-4">BigCommerce</p>

//           {/* Price */}
//           <p className="text-3xl font-semibold text-gray-800 mb-4">$20.00</p>

//           {/* Ratings */}
//           <div className="flex items-center mb-4">
//             <span className="text-yellow-500">★★★★★</span>
//           </div>

//           {/* Product Details (SKU, Weight, Shipping) */}
//           <div className="space-y-2 text-gray-600 mb-6">
//             <p>
//               <strong>SKU:</strong> BCMUG
//             </p>
//             <p>
//               <strong>Weight:</strong> 16.00 Ounces
//             </p>
//             <p>
//               <strong>Shipping:</strong> Calculated at Checkout
//             </p>
//             <p className="text-blue-600">Buy in Bulk & Save</p>
//           </div>

//           {/* Quantity Selector */}
//           <div className="mb-4">
//             <label htmlFor="quantity" className="block text-gray-700 mb-2">
//               Quantity:
//             </label>
//             <select
//               id="quantity"
//               value={quantity}
//               onChange={handleQuantityChange}
//               className="border border-gray-300 rounded-md p-2 w-20"
//             >
//               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
//                 <option key={num} value={num}>
//                   {num}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Add to Cart and Wish List Buttons */}
//           <div className="flex space-x-4 mb-6">
//             <button className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-700">
//               Add to Cart
//             </button>
//             <button className="bg-white text-gray-800 px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-100">
//               Add to Wish List
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default ProductDetail;
