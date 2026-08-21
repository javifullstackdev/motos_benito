import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiFetch from "../api/client";
import logo from "../assets/lightLogo.svg";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      login(data.user);
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0B0D0F] px-4 py-12 text-neutral-200 overflow-hidden select-none">

      <div className="relative z-10 w-full max-w-md">
        
        {/* Contenedor del Logo */}
        <div className="text-center mb-7">
          <img
            src={logo}
            alt="Motos Benito"
            className="h-36 md:h-40 w-auto mx-auto drop-shadow-[0_16px_32px_rgba(0,0,0,0.9)] transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Tarjeta Dark Glassmorphism con reborde metálico superior */}
        <div className="relative rounded-2xl border border-neutral-800/90 bg-[#121417]/85 p-8 sm:p-9 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
          
          {/* Acento racing superior */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-orange-500/80 to-transparent" />

          {/* Encabezado */}
          <div className="mb-7 text-center">
            <h1 className="text-xl font-extrabold tracking-tight text-white uppercase">
              Acceso al Sistema
            </h1>
            <p className="mt-1 text-base text-neutral-400">
              Introduce tus credenciales para gestionar el taller
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Campo Email con icono */}
            <div>
              <label
                htmlFor="email"
                className="block text-base font-bold uppercase tracking-wider text-neutral-300 mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  required
                  className="block w-full rounded-xl border border-neutral-800 bg-neutral-950/90 py-3 pl-10 pr-4 text-sm text-white placeholder:text-neutral-600 transition-all focus:border-orange-500 focus:bg-black focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="usuario@motosbenito.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Campo Contraseña con visor interactivo */}
            <div>
              <label
                htmlFor="password"
                className="block text-base font-bold uppercase tracking-wider text-neutral-300 mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  className="block w-full rounded-xl border border-neutral-800 bg-neutral-950/90 py-3 pl-10 pr-11 text-sm text-white placeholder:text-neutral-600 transition-all focus:border-orange-500 focus:bg-black focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/60 p-3 text-base font-medium text-red-300 animate-in fade-in duration-200">
                <svg className="h-4 w-4 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Botón de Entrada Principal */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-base font-bold text-white shadow-lg shadow-orange-600/30 transition-all duration-200 hover:bg-orange-500 hover:shadow-orange-600/40 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-600"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Verificando credenciales...</span>
                </>
              ) : (
                <>
                  <span>Iniciar sesión</span>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Pie y versión */}
        <div className="mt-8 flex items-center justify-between px-2 text-[11px] text-neutral-500">
          <span>Motos Benito ERP</span>
          <span className="font-mono">v2.4.0 • Build Estable</span>
        </div>

      </div>
    </div>
  );
}

export default Login;