// export default SignInPage;
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signIn,
  signInWithGoogle,
  signInWithFacebook,
} from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const SignInPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle form field change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signIn(formData));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  // Google sign-in
  const handleGoogleSignIn = async () => {
    const result = await dispatch(signInWithGoogle());
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  // Facebook sign-in
  const handleFacebookSignIn = async () => {
    const result = await dispatch(signInWithFacebook());
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex flex-col flex-1 md:flex-row p-6 gap-8 justify-center items-center">
        <div className="w-full max-w-md bg-white shadow-lg p-8 rounded-xl">
          <h3 className="text-3xl font-bold mb-6 text-center text-gray-800 tracking-tight">
            Sign In
          </h3>

          {error && (
            <p className="text-red-500 text-sm text-center mb-6 bg-red-50 p-2 rounded-lg">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-400"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-400"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full p-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200 ${
                status === "loading" ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="my-6 text-center text-sm text-gray-500 relative">
            <span className="relative z-10 bg-white px-4">OR</span>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg py-3 text-gray-700 font-medium hover:bg-gray-50 hover:shadow-md transition-all duration-200"
            >
              <FcGoogle className="mr-3 text-2xl" />
              Sign in with Google
            </button>

            <button
              onClick={handleFacebookSignIn}
              className="flex items-center justify-center w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 hover:shadow-md transition-all duration-200"
            >
              <FaFacebook className="mr-3 text-2xl" />
              Sign in with Facebook
            </button>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/forgot-password"
              className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200"
            >
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
