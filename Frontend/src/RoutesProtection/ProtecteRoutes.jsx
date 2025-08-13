import React, { memo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../Store/authStore";
import LoadingSpinner from "../components/LoadingSpinner";

const ProtectedRoute = memo(({ children }) => {
  const { authenticationState, loading, redirectToOtp } = useAuthStore();
  const { pathname } = useLocation();

  if (loading) return <LoadingSpinner />;
  if (redirectToOtp && pathname !== "/verify") {
    return <Navigate to="/verify" state={{ from: pathname }} replace />;
  }
  if (!authenticationState && pathname !== "/login") {
    return <Navigate to="/login" state={{ from: pathname }} replace />;
  }
  return children;
});

export default ProtectedRoute;
