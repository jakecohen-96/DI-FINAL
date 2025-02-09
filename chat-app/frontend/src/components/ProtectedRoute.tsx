import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("Authentication error:", error);
    return <p>Error loading authentication. Please try again.</p>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;