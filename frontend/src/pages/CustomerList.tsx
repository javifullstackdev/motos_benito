import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiFetch from "../api/client";

type Customer = {
  customerId: number;
  type: string;
  taxId: string;
  name: string;
  phone: string;
  email: string;
  streetType: string;
  streetName: string;
  streetNumber: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
};

function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.taxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    apiFetch("/api/customers")
      .then((data) => setCustomers(data.customers))
      .catch(() => setCustomers([]));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-neutral-100">
      
      {/* Cabecera con título y contador */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
            Clientes
          </h1>
          <p className="text-base sm:text-sm text-neutral-400 mt-1">
            Gestión de fichas de clientes y vehículos asociados
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="rounded-full border border-neutral-800 bg-neutral-900/90 px-3.5 py-1.5 text-base sm:text-sm font-medium text-neutral-300">
            Total: <strong className="text-white font-bold">{filteredCustomers.length}</strong>
          </span>
          <Link
            to="/customers/new"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 sm:px-5 py-2.5 text-base sm:text-sm font-bold text-white shadow-lg shadow-orange-600/25 transition-all hover:bg-orange-500 active:scale-[0.99]"
          >
            <span>+ Nuevo cliente</span>
          </Link>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6 rounded-xl border border-neutral-800/90 bg-neutral-900/80 p-3 sm:p-4 shadow-xl backdrop-blur-xl">
        <div className="relative w-full">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre, NIF/CIF, teléfono o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950/90 py-2.5 sm:py-3 pl-11 pr-4 text-base sm:text-sm text-white placeholder-neutral-500 transition-all focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. VISTA MOBILE: TARJETAS COMPACTAS (< MD)                */}
      {/* ========================================================= */}
      <div className="flex flex-col gap-3 md:hidden">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.customerId}
            className="rounded-2xl border border-neutral-800/90 bg-neutral-900/80 p-4 shadow-lg backdrop-blur-md"
          >
            {/* Cabecera de la tarjeta: Nombre + NIF */}
            <div className="flex items-start justify-between gap-2 border-b border-neutral-800/70 pb-3">
              <div>
                <Link
                  to={`/customers/${customer.customerId}`}
                  className="font-bold text-base text-white hover:text-orange-500 transition-colors line-clamp-1"
                >
                  {customer.name}
                </Link>
                <span className="text-[11px] font-mono text-neutral-400">
                  ID: #{customer.customerId}
                </span>
              </div>
              <span className="font-mono text-base rounded bg-neutral-950 px-2 py-1 border border-neutral-800 text-neutral-300">
                {customer.taxId || "S/N"}
              </span>
            </div>

            {/* Datos de contacto y acciones táctiles */}
            <div className="py-3 flex flex-col gap-2 text-base">
              {/* Teléfono con botón de llamada rápida */}
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Teléfono:</span>
                {customer.phone ? (
                  <a
                    href={`tel:${customer.phone}`}
                    className="flex items-center gap-1.5 font-medium text-orange-400 bg-orange-950/40 border border-orange-500/30 px-2.5 py-1 rounded-lg"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{customer.phone}</span>
                  </a>
                ) : (
                  <span className="text-neutral-600">—</span>
                )}
              </div>

              {/* Email */}
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Email:</span>
                {customer.email ? (
                  <a
                    href={`mailto:${customer.email}`}
                    className="text-neutral-300 hover:text-white truncate max-w-[200px]"
                  >
                    {customer.email}
                  </a>
                ) : (
                  <span className="text-neutral-600">—</span>
                )}
              </div>
            </div>

            {/* Botón Ver Ficha en ancho completo */}
            <div className="pt-2 border-t border-neutral-800/70">
              <Link
                to={`/customers/${customer.customerId}`}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-800/80 border border-neutral-700 py-2.5 text-xs font-bold text-neutral-200 hover:border-orange-500 hover:text-orange-400 transition-colors"
              >
                <span>Ver ficha completa</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-8 text-center text-base text-neutral-400 italic">
            No se encontraron clientes.
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. VISTA DESKTOP: TABLA TRADICIONAL (MD+)                 */}
      {/* ========================================================= */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-neutral-800/90 bg-neutral-900/80 shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/80 text-base font-bold uppercase tracking-wider text-neutral-300">
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">NIF / CIF</th>
                <th className="px-6 py-4">Teléfono</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-sm">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.customerId}
                  className="transition-colors hover:bg-neutral-800/40"
                >
                  <td className="px-6 py-4">
                    <Link
                      to={`/customers/${customer.customerId}`}
                      className="font-bold text-white transition-colors hover:text-orange-500"
                    >
                      {customer.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-mono">
                    <span className="rounded bg-neutral-950/80 px-2.5 py-1 border border-neutral-800 text-base text-neutral-200">
                      {customer.taxId || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-300">
                    {customer.phone ? (
                      <a
                        href={`tel:${customer.phone}`}
                        className="hover:text-orange-400 transition-colors font-medium"
                      >
                        {customer.phone}
                      </a>
                    ) : (
                      <span className="text-neutral-500">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-neutral-300">
                    {customer.email ? (
                      <a
                        href={`mailto:${customer.email}`}
                        className="hover:text-orange-400 transition-colors font-medium"
                      >
                        {customer.email}
                      </a>
                    ) : (
                      <span className="text-neutral-500">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/customers/${customer.customerId}`}
                      className="inline-flex items-center rounded-md border border-neutral-700 bg-neutral-800/90 px-3 py-1.5 text-base font-semibold text-neutral-200 transition-colors hover:border-orange-500 hover:text-orange-400"
                    >
                      Ver ficha →
                    </Link>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-neutral-400 italic"
                  >
                    No se encontraron clientes con el criterio de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default CustomerList;