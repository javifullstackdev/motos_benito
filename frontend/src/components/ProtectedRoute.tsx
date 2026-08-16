import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { employee, isLoading } = useAuth();

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (!employee) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;