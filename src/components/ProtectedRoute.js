// src/components/ProtectedRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { user, status } = useSelector((state) => state.auth);

  // Show a loading spinner while checking authentication status
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // If the user is authenticated, render the protected component
  // Otherwise, redirect to the login page
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
