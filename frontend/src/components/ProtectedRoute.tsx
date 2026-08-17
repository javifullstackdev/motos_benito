import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "./Layout";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { employee, isLoading } = useAuth();

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (!employee) {
    return <Navigate to="/login" />;
  }

  return <Layout>{children}</Layout>;
}

export default ProtectedRoute;