// components/ShoppingCart.js
import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteFromCart,
  updateQuantity,
  purchaseItems,
} from "../redux/slices/cardSlice";
import Stepper from "../components/Stepper"; // Import the Stepper component

const ShoppingCart = () => {
  const { items: cartItems, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const user = useSelector((state) => state.auth.user);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
  };

  const handleRemoveItem = (itemId) => {
    dispatch(deleteFromCart(itemId));
  };

  const handleCheckout = () => {
    console.log("use's uid : ", user.uid);
    dispatch(purchaseItems({ userId: user.uid })); // Dispatch the purchaseItems action
    setActiveStep(2); // Move to the final step after checkout
  };

  const handleNextStep = () => {
    if (activeStep < 2) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleGoToShop = () => {
    // Redirect to the shop page
    window.location.href = "/shop";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Stepper activeStep={activeStep} />

        {activeStep === 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">
              Shopping Cart
            </h1>
            <div className="space-y-8">
              {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-row items-start border-b pb-6"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover mr-6 rounded"
                    />
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-800 mb-2">
                        {item.name}
                      </h2>
                      <p className="text-gray-500 text-sm mb-4">#233565</p>
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
            <div className="mt-8">
              <button
                onClick={handleNextStep}
                className="w-full bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-900 transition duration-200 shadow-md"
                disabled={cartItems.length === 0}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {activeStep === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
              <a
                href="#"
                className="text-gray-500 mr-2 hover:text-gray-700"
                onClick={handlePreviousStep}
              >
                ←
              </a>
              Card Details
            </h2>
            <div className="bg-gray-200 rounded-lg p-4 mb-6 shadow-inner">
              <div className="text-gray-700 font-semibold">
                2233 4455 6677 8899
              </div>
              <div className="text-gray-500 text-sm">08 / 22</div>
              <div className="text-gray-700 font-medium">Alena Tsybulenka</div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png"
                alt="Mastercard"
                className="w-12 h-8 mt-2"
              />
            </div>
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
            <div className="mt-8">
              <p className="text-gray-700 font-medium text-lg">
                Subtotal: ${totalAmount}
              </p>
              <button
                onClick={handleCheckout}
                className="w-full bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg mt-6 hover:bg-gray-900 transition duration-200 shadow-md"
                disabled={cartItems.length === 0}
              >
                Check Out
              </button>
            </div>
            <div className="mt-4">
              <button
                onClick={handlePreviousStep}
                className="w-full bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">
              Checkout Complete
            </h2>
            <p className="text-gray-700 mb-8">
              Your purchase has been successfully completed. Thank you for
              shopping with us!
            </p>
            <button
              onClick={handleGoToShop}
              className="w-full bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-900 transition duration-200 shadow-md"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
