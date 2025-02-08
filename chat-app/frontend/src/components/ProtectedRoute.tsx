import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;

  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;