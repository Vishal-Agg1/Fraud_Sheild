import React from "react";
import { Navigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";

const ProtectedRoute = ({ children }) => {
  const { user } = usePrivy(); // Check if the user is authenticated

  if (!user) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/" />;
  }

  // If authenticated, render the children components (e.g., Dashboard)
  return children;
};

export default ProtectedRoute;
