import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../features/auth/auth.context.jsx";
import { useAuth } from "../features/auth/hooks/useAuth.js";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();
  const { getUser } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  console.log("User authenticated, rendering protected route:", user);
  return children;
};

export default ProtectedRoute;