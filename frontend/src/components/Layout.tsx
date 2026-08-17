import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { employee, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-bold text-lg">Motos Benito</Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="sm:hidden text-2xl"
          >
            ☰
          </button>

          <div className="hidden sm:flex sm:items-center sm:gap-4">
            <Link to="/customers" className="text-gray-600 hover:text-gray-900">Clientes</Link>
            <Link to="/items" className="text-gray-600 hover:text-gray-900">Artículos</Link>
            <Link to="/invoices" className="text-gray-600 hover:text-gray-900">Facturas</Link>
            {employee && <span className="text-sm text-gray-500">{employee.firstName}</span>}
            <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
              Cerrar sesión
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="flex flex-col gap-3 mt-4 sm:hidden">
            <Link to="/customers" onClick={() => setIsMenuOpen(false)} className="text-gray-600">Clientes</Link>
            <Link to="/items" onClick={() => setIsMenuOpen(false)} className="text-gray-600">Artículos</Link>
            <Link to="/invoices" onClick={() => setIsMenuOpen(false)} className="text-gray-600">Facturas</Link>
            {employee && <span className="text-sm text-gray-500">{employee.firstName}</span>}
            <button onClick={handleLogout} className="text-sm text-red-600 text-left">
              Cerrar sesión
            </button>
          </div>
        )}
      </nav>
      <main>{children}</main>
    </div>
  );
}

export default Layout;