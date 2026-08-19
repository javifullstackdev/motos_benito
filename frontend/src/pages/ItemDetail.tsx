import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiFetch from "../api/client";

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    unitPrice: "",
    inStock: false,
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setIsFetching(true);
    apiFetch(`/api/items/${id}`)
      .then((data) => {
        if (data.item) {
          setFormData({
            name: data.item.name || "",
            unitPrice: data.item.unitPrice?.toString() || "",
            inStock: Boolean(data.item.inStock),
          });
        }
      })
      .catch(() => setError("No se pudo cargar la ficha del artículo"))
      .finally(() => setIsFetching(false));
  }, [id]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      await apiFetch(`/api/items/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          unitPrice: Number(formData.unitPrice),
        }),
      });
      setSuccessMessage("Artículo actualizado correctamente");
      setTimeout(() => {
        navigate("/items");
      }, 1000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-neutral-400">
        <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent mb-3" />
        <p className="text-xs uppercase tracking-wider">Cargando artículo...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-neutral-100">
      {/* Botón de retroceso */}
      <div className="mb-6">
        <Link
          to="/items"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-orange-500 transition-colors"
        >
          <span>← Volver al catálogo de artículos</span>
        </Link>
      </div>

      {/* Tarjeta Dark Glassmorphism */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800/90 bg-neutral-900/85 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Acento decorativo naranja superior */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 via-orange-500 to-neutral-800" />

        {/* Encabezado con ID e indicador */}
        <div className="mb-6 border-b border-neutral-800 pb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-950/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-500">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              Edición de Catálogo
            </span>
            <span className="rounded bg-neutral-950 px-2 py-0.5 font-mono text-xs text-neutral-400 border border-neutral-800">
              REF #{id}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">
            {formData.name || "Detalle de Artículo"}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Actualiza la descripción, tarifa o disponibilidad física en el taller
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Nombre */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5"
            >
              Descripción / Nombre del Artículo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Ej. Kit Arrastre RK 525, Cambio de Aceite 10W40, etc."
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950/90 px-4 py-3 text-sm text-white placeholder-neutral-500 transition-all focus:border-orange-500 focus:bg-black focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Campo Precio Unitario */}
          <div>
            <label
              htmlFor="unitPrice"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5"
            >
              Precio Unitario (€ IVA incluido) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                id="unitPrice"
                name="unitPrice"
                required
                placeholder="0.00"
                value={formData.unitPrice}
                onChange={handleChange}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950/90 py-3 pl-4 pr-10 text-sm font-mono text-white placeholder-neutral-500 transition-all focus:border-orange-500 focus:bg-black focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 font-mono text-sm font-bold text-neutral-400">
                €
              </span>
            </div>
          </div>

          {/* Switch / Checkbox de Disponibilidad en Stock */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
            <label
              htmlFor="inStock"
              className="flex items-center justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="block text-sm font-bold text-white">
                    Disponible en Stock
                  </span>
                  {formData.inStock ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Disponible
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900 border border-neutral-700 px-2 py-0.5 text-[10px] font-semibold text-neutral-400">
                      Agotado
                    </span>
                  )}
                </div>
                <span className="block text-xs text-neutral-400 mt-1">
                  Indica si el recambio cuenta con existencias directas en las instalaciones
                </span>
              </div>
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                checked={formData.inStock}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, inStock: e.target.checked }))
                }
                className="h-5 w-5 rounded border-neutral-700 bg-neutral-900 text-orange-600 focus:ring-orange-500 focus:ring-offset-neutral-950 accent-orange-500 cursor-pointer"
              />
            </label>
          </div>

          {/* Feedback de Éxito */}
          {successMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/60 p-3.5 text-xs font-medium text-emerald-300 animate-in fade-in duration-200">
              <svg
                className="h-4 w-4 flex-shrink-0 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Feedback de Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/60 p-3.5 text-xs font-medium text-red-300 animate-in fade-in duration-200">
              <svg
                className="h-4 w-4 flex-shrink-0 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-center gap-3">
            <Link
              to="/items"
              className="w-full sm:w-auto text-center rounded-xl border border-neutral-700 bg-neutral-900 px-5 py-3 text-xs font-bold text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-600/30 transition-all duration-200 hover:bg-orange-500 hover:shadow-orange-600/40 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Guardando cambios...</span>
                </>
              ) : (
                <span>Guardar cambios</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ItemDetail;