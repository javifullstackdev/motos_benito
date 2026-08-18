import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiFetch from "../api/client";

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", unitPrice: "", inStock: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    apiFetch(`/api/items/${id}`)
      .then((data) => setFormData(data.item))
      .catch(() => setError("No se pudo cargar el artículo"));
  }, [id]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await apiFetch(`/api/items/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      navigate("/items");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Editar artículo</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" id="name" name="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={formData.name} onChange={handleChange} />
          </div>
          <div className="mb-4">
            <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700">Precio unitario</label>
            <input type="number" id="unitPrice" name="unitPrice" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={formData.unitPrice} onChange={handleChange} />
            </div>

            <div className="mb-4 flex items-center gap-2">
            <input
                type="checkbox"
                id="inStock"
                name="inStock"
                checked={formData.inStock}
                onChange={(e) => setFormData((prev) => ({ ...prev, inStock: e.target.checked }))}
                className="h-4 w-4"
            />
            <label htmlFor="inStock" className="text-sm font-medium text-gray-700">En stock</label>
            </div>
          <button type="submit" disabled={isLoading} className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
            {isLoading ? "Guardando..." : "Guardar cambios"}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default ItemDetail;