import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../redux/auth/authSlice";
import { AuthStatus } from "../redux/types";

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error } = useSelector((state) => state.auth);

  const handleReset = (e) => {
    e.preventDefault();
    dispatch(resetPassword(email));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-col flex-1 md:flex-row p-6 gap-6 justify-center items-center">
        <div className="w-full max-w-md bg-white shadow-md p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Forgot Password
          </h3>

          {status === AuthStatus.SUCCEEDED && (
            <p className="text-green-500 text-sm text-center">
              Password reset link sent to your email.
            </p>
          )}
          {status === AuthStatus.FAILED && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2"
              >
                Enter Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                disabled={status === AuthStatus.LOADING}
              >
                {status === AuthStatus.LOADING
                  ? "Sending..."
                  : "Send Reset Link"}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-blue-500 hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
