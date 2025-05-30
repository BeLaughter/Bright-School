// src/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function PrivateRoute({ children, requiredRole }) {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // You can replace with a spinner
  }

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  if (requiredRole && userProfile?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;
