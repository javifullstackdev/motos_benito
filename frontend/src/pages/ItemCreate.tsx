import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiFetch from "../api/client";
import Card from "../components/ui/Card";
import FormLabel from "../components/ui/FormLabel";
import TextInput from "../components/ui/TextInput";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

function ItemCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    unitPrice: "",
    inStock: true,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await apiFetch("/api/items", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          unitPrice: Number(formData.unitPrice),
        }),
      });
      navigate("/items");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-neutral-100">
      {/* Botón de retroceso y migas de pan */}
      <div className="mb-6">
        <Link
          to="/items"
          className="inline-flex items-center gap-2 text-base font-semibold uppercase tracking-wider text-neutral-400 hover:text-orange-500 transition-colors"
        >
          <span>← Volver al listado de artículos</span>
        </Link>
      </div>

      <Card className="p-6 sm:p-8">
        {/* Encabezado del Formulario */}
        <div className="mb-6 border-b border-neutral-800 pb-5">
          <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">
            Alta de Producto / Servicio
          </h1>
          <p className="text-base text-neutral-400 mt-1">
            Registra una nueva pieza, recambio o concepto de mano de obra
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Nombre del Artículo */}
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

          {/* Toggle / Checkbox de Disponibilidad en Stock */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
            <label
              htmlFor="inStock"
              className="flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="block text-sm font-bold text-white">
                  Disponible en Stock
                </span>
                <span className="block text-base text-neutral-400 mt-0.5">
                  Marca si el producto cuenta con unidades físicas listas en el almacén
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

          {/* Mensaje de Error */}
          {error && <Alert variant="error">{error}</Alert>}

          {/* Botones de Acción */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-center gap-3">
            <Link
              to="/items"
              className="w-full sm:w-auto text-center rounded-xl border border-neutral-700 bg-neutral-900 px-5 py-3 text-base font-bold text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              Cancelar
            </Link>

            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="Guardando en catálogo..."
              className="flex-1"
            >
              Guardar artículo
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ItemCreate;