import React, { useState } from "react";
import {
  FiTrash2,
  FiArrowLeft,
  FiCheckCircle,
  FiShoppingCart,
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteFromCart,
  updateQuantity,
  purchaseItems,
  clearCart,
} from "../redux/slices/cardSlice";
import Stepper from "../components/Stepper";
import { useNavigate } from "react-router-dom";

const ShoppingCart = () => {
  const { items: cartItems, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      dispatch(deleteFromCart(itemId));
    }
  };

  const handleCheckout = () => {
    try {
      dispatch(purchaseItems({ userId: user.uid }));
      dispatch(clearCart());
      setActiveStep(2);
    } catch (error) {
      alert("Checkout failed. Please try again.");
    }
  };

  const handleNextStep = () => {
    if (activeStep < 2 && cartItems.length > 0) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleGoToShop = () => navigate("/shop");
  const handleViewOrder = () => navigate("/orders");

  const steps = [
    { title: "Cart", description: "Review your items" },
    { title: "Payment", description: "Enter payment details" },
    { title: "Confirmation", description: "Order complete" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Stepper activeStep={activeStep} steps={steps} />

        {/* Step 1: Cart Review */}
        {activeStep === 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Your Shopping Cart
            </h1>

            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                  <FiShoppingCart className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Your cart is empty
                </h3>
                <button
                  onClick={handleGoToShop}
                  className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start border-b pb-6 gap-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h2 className="font-medium text-gray-800">
                            {item.name}
                          </h2>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-500"
                            aria-label="Remove item"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                        <p className="text-gray-500 text-sm mb-3">
                          SKU: {item.id}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded-md">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="px-4 py-1">{item.quantity}</span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-4 border-t">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-medium">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={handleNextStep}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 2: Payment */}
        {activeStep === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={handlePreviousStep}
                className="text-gray-500 hover:text-gray-700 mr-2"
              >
                <FiArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-bold text-gray-800">
                Payment Information
              </h2>
            </div>

            <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-green-800">
                  •••• •••• •••• 4242
                </span>
                <img src="/visa-logo.png" alt="Visa" className="h-6" />
              </div>
              <div className="text-sm text-green-600">
                Expires 12/25 • {user?.name || "Cardholder Name"}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.name || ""}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Subtotal</span>
                <span className="font-medium">${totalAmount.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <FiCheckCircle size={18} />
                Complete Purchase
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {activeStep === 2 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto">
            <div className="bg-green-100 p-4 rounded-full inline-flex mb-4">
              <FiCheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Order Confirmed!
            </h2>
            <p className="text-gray-600 mb-4">
              Thank you for your purchase. Your order #12345 has been received.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left text-sm">
              <p className="font-medium text-gray-700 mb-2">What to expect:</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Order confirmation email with details</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Shipping updates within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Delivery in 3-5 business days</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleViewOrder}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                View Order Details
              </button>
              <button
                onClick={handleGoToShop}
                className="w-full bg-white text-green-600 py-2 rounded-lg border border-green-600 hover:bg-green-50 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
