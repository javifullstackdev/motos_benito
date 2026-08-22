import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiFetch from "../api/client";
import { normalizeInputValue } from "../utils/formatting";
import ConfirmDialog from "../components/ConfirmDialog";
import Card from "../components/ui/Card";
import FormLabel from "../components/ui/FormLabel";
import TextInput from "../components/ui/TextInput";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Select from "../components/ui/Select";

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    unitPrice: "",
    billingUnit: "unit",
    inStock: false,
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsFetching(true);
    apiFetch(`/api/items/${id}`)
      .then((data) => {
        if (data.item) {
          setFormData({
            name: data.item.name || "",
            unitPrice: data.item.unitPrice?.toString() || "",
            billingUnit: data.item.billingUnit || "unit",
            inStock: Boolean(data.item.inStock),
          });
        }
      })
      .catch(() => setError("No se pudo cargar la ficha del artículo"))
      .finally(() => setIsFetching(false));
  }, [id]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: normalizeInputValue(event.target, value),
    }));
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

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await apiFetch(`/api/items/${id}`, { method: "DELETE" });
      navigate("/items");
    } catch (err) {
      setError((err as Error).message);
      setIsConfirmOpen(false);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isFetching) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-neutral-400">
        <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent mb-3" />
        <p className="text-base uppercase tracking-wider">Cargando artículo...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-neutral-100">
      {/* Botón de retroceso */}
      <div className="mb-6">
        <Link
          to="/items"
          className="inline-flex items-center gap-2 text-base font-semibold uppercase tracking-wider text-neutral-400 hover:text-orange-500 transition-colors"
        >
          <span>← Volver al catálogo de productos</span>
        </Link>
      </div>

      <Card className="p-6 sm:p-8">
        {/* Encabezado con ID e indicador */}
        <div className="mb-6 border-b border-neutral-800 pb-5">
          <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">
            {formData.name || "Detalle de Artículo"}
          </h1>
          <p className="text-base text-neutral-400 mt-1">
            Actualiza la descripción, tarifa o disponibilidad en el taller
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Nombre */}
          <div>
            <FormLabel htmlFor="name">Descripción / Nombre del Artículo *</FormLabel>
            <TextInput
              type="text"
              id="name"
              name="name"
              required
              placeholder="Ej. Kit Arrastre RK 525, Cambio de Aceite 10W40, etc."
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Campo Precio Unitario */}
          <div>
            <FormLabel htmlFor="unitPrice">Precio Unitario (€ IVA incluido) *</FormLabel>
            <div className="relative">
              <TextInput
                type="number"
                step="0.01"
                min="0"
                id="unitPrice"
                name="unitPrice"
                required
                placeholder="0.00"
                value={formData.unitPrice}
                onChange={handleChange}
                className="pr-10 font-mono"
              />
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 font-mono text-sm font-bold text-neutral-400">
                €
              </span>
            </div>
          </div>

          <div>
            <FormLabel htmlFor="billingUnit">Tipo de Facturación</FormLabel>
            <Select id="billingUnit" name="billingUnit" value={formData.billingUnit} onChange={handleChange}>
              <option value="unit">Por unidad</option>
              <option value="hour">Por hora</option>
              <option value="minute">Por minuto</option>
            </Select>
          </div>

          {/* Switch / Checkbox de Disponibilidad en Stock */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
            <label htmlFor="inStock" className="flex items-center justify-between cursor-pointer">
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
                <span className="block text-base text-neutral-400 mt-1">
                  Indica si el producto cuenta con existencias en el taller
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
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          {/* Feedback de Error */}
          {error && <Alert variant="error">{error}</Alert>}

          {/* Botones de Acción */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-center gap-3">
            <Link
              to="/items"
              className="w-full sm:w-auto text-center rounded-xl border border-neutral-700 bg-neutral-900 px-5 py-3 text-base font-bold text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              Cancelar
            </Link>

            <Button type="submit" isLoading={isLoading} loadingText="Guardando cambios..." className="flex-1">
              Guardar cambios
            </Button>

            <Button
              type="button"
              variant="danger"
              onClick={() => setIsConfirmOpen(true)}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar artículo"}
            </Button>
          </div>
        </form>
      </Card>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Eliminar producto"
        message="¿Estás seguro de querer eliminar este producto? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}

export default ItemDetail;