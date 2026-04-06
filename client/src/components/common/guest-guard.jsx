import React from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const GuestGuard = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (user.role === "guest") {
    toast.error("Guest users cannot access this page.");
    return <Navigate to="/shop/home" replace />;
  }

  return children;
};

export default GuestGuard;
