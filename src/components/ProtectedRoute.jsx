import React from "react";
import { Navigate } from "react-router-dom";




const ProtectedRoute = ({ children, role }) => {
  const userRole = localStorage.getItem("role");




  // not logged in
  if (!userRole) {
    return <Navigate to="/access-required" replace />;
  }




  // wrong role
  if (role && userRole !== role) {
    return <Navigate to="/access-required" replace />;
  }




  return children;
};
export default ProtectedRoute;
