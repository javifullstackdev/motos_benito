import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoNav from "../assets/lightLogo.svg";
import Footer from "./Footer";

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { employee, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const sidebarLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 border ${
      isActive
        ? "bg-neutral-950/90 border-neutral-700/80 text-white shadow-inner [&>svg]:text-orange-500"
        : "border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900/40 [&>svg]:text-neutral-500"
    }`;

  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
      isActive
        ? "bg-orange-600/20 text-orange-500 border border-orange-500/40"
        : "text-neutral-300 hover:bg-neutral-800/60 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-[#0B0D0F] text-neutral-100 flex flex-col md:flex-row selection:bg-orange-500 selection:text-white">
      
      {/* ========================================================= */}
      {/* 1. SIDEBAR LATERAL FIJO (SOLO DESKTOP / MD+)              */}
      {/* ========================================================= */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-40 border-r border-neutral-800/90 bg-[#121417] p-5 justify-between">
        
        <div className="flex flex-col gap-8">
          {/* Logo Superior */}
          <Link
            to="/"
            className="flex items-center justify-center p-2 rounded-xl transition-transform hover:scale-[1.02]"
          >
            <img
              src={logoNav}
              alt="Motos Benito"
              className="h-40 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            />
          </Link>

          {/* Menú de Navegación Vertical */}
          <nav className="flex flex-col gap-2">
            <div className="px-3 pb-1 text-base font-bold uppercase tracking-wider text-orange-500">
              Gestión Taller
            </div>

            <NavLink to="/customers" className={sidebarLinkClasses}>
              <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Clientes</span>
            </NavLink>

            <NavLink to="/items" className={sidebarLinkClasses}>
              <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Productos / Servicios</span>
            </NavLink>

            <NavLink to="/invoices" className={sidebarLinkClasses}>
              <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Facturas</span>
            </NavLink>
          </nav>
        </div>

        {/* Sección Inferior: Usuario y Salida */}
        <div className="border-t border-neutral-800/80 pt-4 flex flex-col gap-3">
          {employee && (
            <div className="flex items-center gap-3 rounded-xl bg-neutral-950/80 border border-neutral-800 p-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <div className="overflow-hidden">
                <p className="text-[11px] uppercase font-bold text-neutral-400">En turno</p>
                <p className="text-sm font-semibold text-white truncate">{employee.firstName}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/25 bg-red-950/30 px-3 py-2.5 text-xs font-bold text-red-400 transition-all hover:bg-red-900/40 hover:border-red-500/40 hover:text-red-300"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. HEADER SUPERIOR (SOLO MOBILE / HASTA MD)               */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-800/80 bg-[#121417]/95 px-4 py-3 backdrop-blur-md md:hidden flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoNav} alt="Motos Benito" className="h-9 w-auto object-contain" />
        </Link>

        {/* Botón hamburguesa animado */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          className="relative flex h-10 w-10 flex-col items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-white"
        >
          <span
            className={`block h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${
              isMobileMenuOpen ? "translate-y-1.5 rotate-45 bg-orange-500" : "-translate-y-1"
            }`}
          />
          <span
            className={`block h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0 -translate-x-2" : "opacity-100"
            }`}
          />
          <span
            className={`block h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${
              isMobileMenuOpen ? "-translate-y-1.5 -rotate-45 bg-orange-500" : "translate-y-1"
            }`}
          />
        </button>

        {/* Menú Desplegable Móvil */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 border-b border-neutral-800 bg-[#121417]/95 p-4 backdrop-blur-xl flex flex-col gap-2 shadow-2xl">
            <NavLink to="/customers" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClasses}>
              <span>Clientes</span>
              <span>→</span>
            </NavLink>
            <NavLink to="/items" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClasses}>
              <span>Productos / Servicios</span>
              <span>→</span>
            </NavLink>
            <NavLink to="/invoices" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClasses}>
              <span>Facturas</span>
              <span>→</span>
            </NavLink>

            <div className="my-2 border-t border-neutral-800" />

            {employee && (
              <div className="flex items-center justify-between px-3 py-2 text-xs rounded-lg bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400">Mecánico:</span>
                <span className="font-semibold text-orange-500">{employee.firstName}</span>
              </div>
            )}

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="mt-1 w-full rounded-xl border border-red-500/20 bg-red-950/40 px-4 py-3 text-center text-xs font-bold text-red-400"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* 3. ÁREA DE CONTENIDO PRINCIPAL (CON OFFSET MD:PL-64)      */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </div>

    </div>
  );
}

export default Layout;