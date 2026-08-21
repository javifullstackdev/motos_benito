import { useEffect, useState } from "react";
import apiFetch from "../api/client";
import { Link } from "react-router-dom";

type Item = {
  itemId: number;
  name: string;
  unitPrice: number;
  inStock: boolean;
};

function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unitPrice.toString().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    apiFetch("/api/items")
      .then((data) => setItems(data.items))
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-neutral-200">
      {/* Cabecera con título, contador y acción principal */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
            Productos y Servicios
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Gestión de repuestos, accesorios, mano de obra e intervenciones de taller
          </p>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3">
          <span className="rounded-full border border-neutral-800 bg-neutral-900/90 px-3.5 py-1.5 text-base sm:text-sm font-medium text-neutral-400">
            Total: <strong className="text-white">{filteredItems.length}</strong>
          </span>
          <Link
            to="/items/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-base sm:text-sm font-semibold text-white shadow-lg shadow-orange-600/25 transition-all hover:bg-orange-500 active:scale-[0.99]"
          >
            <span>+ Nuevo producto / servicio</span>
          </Link>
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-6 rounded-xl border border-neutral-800/90 bg-neutral-900/80 p-3 shadow-xl backdrop-blur-xl">
        <div className="relative w-full">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre de artículo, recambio, servicio o precio unitario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950/90 py-2.5 pl-10 pr-4 text-base sm:text-sm text-white placeholder-neutral-500 transition-all focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. VISTA MOBILE: TARJETAS CON PRECIO EN 2 LÍNEAS (< MD)    */}
      {/* ========================================================= */}
      <div className="flex flex-col gap-3 md:hidden">
        {filteredItems.map((item) => (
          <div
            key={item.itemId}
            className="rounded-2xl border border-neutral-800/90 bg-neutral-900/80 p-4 shadow-lg backdrop-blur-md"
          >
            <div className="flex items-start justify-between gap-3">
              {/* Nombre y disponibilidad */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/items/${item.itemId}`}
                  className="font-bold text-base text-white hover:text-orange-500 transition-colors block line-clamp-2"
                >
                  {item.name}
                </Link>
                <div className="mt-2">
                  {item.inStock ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      En stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950/80 border border-neutral-700 px-2 py-0.5 text-[11px] font-semibold text-neutral-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-500" />
                      Bajo pedido
                    </span>
                  )}
                </div>
              </div>

              {/* Bloque de Precio en 2 líneas protegidas (sin romperse) */}
              <div className="flex-shrink-0 text-right whitespace-nowrap rounded-xl bg-neutral-950/90 border border-neutral-800 px-3 py-2">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Precio unit.
                </span>
                <span className="block font-mono text-base font-bold text-orange-500">
                  {Number(item.unitPrice).toFixed(2)} €
                </span>
              </div>
            </div>

            {/* Acción inferior */}
            <div className="mt-3 pt-3 border-t border-neutral-800/70">
              <Link
                to={`/items/${item.itemId}`}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-neutral-800/80 border border-neutral-700 py-2 text-base font-bold text-neutral-200 hover:border-orange-500 hover:text-orange-400 transition-colors"
              >
                <span>Editar / Ver detalle</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-8 text-center text-base text-neutral-400 italic">
            No se encontraron artículos o servicios con ese criterio.
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. VISTA DESKTOP: TABLA COMPLETA (MD+)                    */}
      {/* ========================================================= */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-neutral-800/90 bg-neutral-900/80 shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60 text-base font-bold uppercase tracking-wider text-neutral-400">
                <th className="px-6 py-4">Artículo / Referencia</th>
                <th className="px-6 py-4">Precio Unitario</th>
                <th className="px-6 py-4">Disponibilidad</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-sm">
              {filteredItems.map((item) => (
                <tr
                  key={item.itemId}
                  className="transition-colors hover:bg-neutral-800/40"
                >
                  <td className="px-6 py-4">
                    <Link
                      to={`/items/${item.itemId}`}
                      className="font-semibold text-white transition-colors hover:text-orange-500 flex items-center gap-2"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-orange-500">
                    <span className="rounded bg-neutral-950/80 px-2.5 py-1 border border-neutral-800 text-base">
                      {Number(item.unitPrice).toFixed(2)} €
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.inStock ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-0.5 text-base font-semibold text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        En stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950/80 border border-neutral-700 px-2.5 py-0.5 text-base font-semibold text-neutral-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-neutral-500" />
                        Bajo pedido / Agotado
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/items/${item.itemId}`}
                      className="inline-flex items-center rounded-md border border-neutral-700 bg-neutral-800/80 px-2.5 py-1 text-base font-medium text-neutral-300 transition-colors hover:border-orange-500 hover:text-orange-400"
                    >
                      Editar / Detalle →
                    </Link>
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-neutral-500 italic"
                  >
                    No se encontraron artículos o servicios con el criterio de búsqueda.
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

export default ItemList;