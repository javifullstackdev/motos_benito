import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../api/client";

function CustomerCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "",
    taxId: "",
    name: "",
    phone: "",
    email: "",
    streetType: "",
    streetName: "",
    streetNumber: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await apiFetch("/api/customers", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      navigate("/customers");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4">Crear cliente</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo de cliente</label>
                        <select id="type" name="type" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={formData.type} onChange = {handleChange}>
                            <option value="particular">Particular</option>
                            <option value="autonomo">Autónomo</option>
                            <option value="empresa">Empresa</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">NIF/CIF</label>
                        <input type="text" id="taxId" name="taxId" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={formData.taxId} onChange={handleChange} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input type="text" id="name" name="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <input type="tel" id="phone" name="phone" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="streetType" className="block text-sm font-medium text-gray-700">Tipo de vía</label>
                        <select id="streetType" name="streetType" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={formData.streetType} onChange={handleChange}>
                            <option value="calle">Calle</option>
                            <option value="avenida">Avenida</option>
                            <option value="plaza">Plaza</option>
                            <option value="pasaje">Pasaje</option>
                            <option value="paseo">Camino</option>
                            <option value="paseo">Paseo</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="streetName" className="block text-sm font-medium text-gray-700">Nombre de la calle</label>
                        <input type="text" id="streetName" name="streetName" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={formData.streetName} onChange={handleChange} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="streetNumber" className="block text-sm font-medium text-gray-700">Número de la calle</label>
                        <input type="text" id="streetNumber" name="streetNumber" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={formData.streetNumber} onChange={handleChange} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ciudad</label>
                        <input type="text" id="city" name="city" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={formData.city} onChange={handleChange} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="province" className="block text-sm font-medium text-gray-700">Provincia</label>
                        <input type="text" id="province" name="province" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={formData.province} onChange={handleChange} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Código postal</label>
                        <input type="text" id="postalCode" name="postalCode" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={formData.postalCode} onChange={handleChange} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">País</label>
                        <input type="text" id="country" name="country" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={formData.country} onChange={handleChange} />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600" disabled={isLoading}>{isLoading ? "Cargando..." : "Crear cliente"}</button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default CustomerCreate;