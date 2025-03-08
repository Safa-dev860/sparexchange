import React from "react";
import { FiTrash2 } from "react-icons/fi"; // Import trash icon from react-icons
import { useSelector, useDispatch } from "react-redux"; // Import Redux hooks
import {
  deleteFromCart,
  updateQuantity,
  purchaseItems,
} from "../redux/slices/cardSlice"; // Adjust the import path to your cartSlice file

const ShoppingCart = () => {
  // Access Redux state
  const { items: cartItems, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Handle quantity changes
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1
    dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
  };

  // Handle remove item
  const handleRemoveItem = (itemId) => {
    dispatch(deleteFromCart(itemId));
  };

  // Handle checkout (purchase items)
  const handleCheckout = () => {
    dispatch(purchaseItems());
    // Optionally, redirect or show a confirmation message here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            Shopping Cart
          </h1>

          {/* Horizontal Layout for Cart Items and Card Details */}
          <div className="flex flex-row gap-6">
            {/* Cart Items */}
            <div className="w-1/2 space-y-8">
              {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-row items-start border-b pb-6"
                  >
                    {/* Item Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover mr-6 rounded"
                    />

                    {/* Item Details */}
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-800 mb-2">
                        {item.name}
                      </h2>
                      <p className="text-gray-500 text-sm mb-4">#233565</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center mb-4">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l hover:bg-gray-300 transition duration-200"
                        >
                          -
                        </button>
                        <span className="px-5 py-2 bg-gray-100 text-gray-800 font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r hover:bg-gray-300 transition duration-200"
                        >
                          +
                        </button>
                      </div>

                      {/* Price and Remove Icon */}
                      <div className="flex items-center justify-between">
                        <p className="text-gray-800 font-medium text-lg">
                          ${item.price} ×
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition duration-200"
                          aria-label="Remove item"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Card Details */}
            <div className="w-1/2">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <a href="#" className="text-gray-500 mr-2 hover:text-gray-700">
                  ←
                </a>
                Card Details
              </h2>

              {/* Card Display (Mock) */}
              <div className="bg-gray-200 rounded-lg p-4 mb-6 shadow-inner">
                <div className="text-gray-700 font-semibold">
                  2233 4455 6677 8899
                </div>
                <div className="text-gray-500 text-sm">08 / 22</div>
                <div className="text-gray-700 font-medium">
                  Alena Tsybulenka
                </div>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png"
                  alt="Mastercard"
                  className="w-12 h-8 mt-2"
                />
              </div>

              {/* Card Input Fields (Mock, non-functional for simplicity) */}
              <div className="space-y-6">
                <div>
                  <label className="text-gray-700 font-medium mb-2">
                    Name on card
                  </label>
                  <input
                    type="text"
                    value="Alena Tsybulenka"
                    readOnly
                    className="w-full p-3 border rounded-lg mt-1 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-gray-700 font-medium mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value="2233 4455 6677 8899"
                    readOnly
                    className="w-full p-3 border rounded-lg mt-1 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="text-gray-700 font-medium mb-2">
                      Expiration date
                    </label>
                    <input
                      type="text"
                      value="mm / yyyy"
                      readOnly
                      className="w-full p-3 border rounded-lg mt-1 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="text-gray-700 font-medium mb-2">
                      CSV code
                    </label>
                    <input
                      type="text"
                      value="XXX"
                      readOnly
                      className="w-full p-3 border rounded-lg mt-1 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Subtotal and Checkout Button */}
              <div className="mt-8">
                <p className="text-gray-700 font-medium text-lg">
                  Subtotal: ${totalAmount}
                </p>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg mt-6 hover:bg-gray-900 transition duration-200 shadow-md"
                  disabled={cartItems.length === 0} // Disable if cart is empty
                >
                  Check Out
                </button>
              </div>
            </div>
          </div>

          {/* Continue Shopping Link */}
          <a
            href="/shop"
            className="text-gray-500 hover:text-gray-700 text-sm mt-6 inline-block underline"
          >
            ← Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
