import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiFetch from "../api/client";
import { normalizeInputValue } from "../utils/formatting";
import { isValidSpanishTaxId } from "../utils/taxId";
import Card from "../components/ui/Card";
import FormLabel from "../components/ui/FormLabel";
import TextInput from "../components/ui/TextInput";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

function CustomerCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "particular",
    taxId: "",
    name: "",
    phone: "",
    email: "",
    streetType: "calle",
    streetName: "",
    streetNumber: "",
    city: "",
    province: "",
    postalCode: "",
    country: "España",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: normalizeInputValue(event.target, value),
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!isValidSpanishTaxId(formData.taxId)) {
      setError("El NIF/NIE/CIF introducido no es válido. Revisa el número y la letra de control.");
      return;
    }

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
    <div className="max-w-4xl mx-auto px-4 py-8 text-neutral-100">
      {/* Botón de retroceso */}
      <div className="mb-6">
        <Link
          to="/customers"
          className="inline-flex items-center gap-2 text-base font-semibold uppercase tracking-wider text-neutral-400 hover:text-orange-500 transition-colors"
        >
          <span>← Volver al directorio de clientes</span>
        </Link>
      </div>

      <Card className="p-6 sm:p-9">
        {/* Encabezado */}
        <div className="mb-8 border-b border-neutral-800 pb-5">
          <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">
            Alta de Nuevo Cliente
          </h1>
          <p className="text-base text-neutral-400 mt-1">
            Introduce los datos fiscales y de localización para facturación y contacto
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECCIÓN 1: DATOS FISCALES Y DE CONTACTO */}
          <div>
            <h2 className="text-base font-bold uppercase tracking-wider text-orange-500 mb-4 flex items-center gap-2">
              <span>01</span>
              <span className="text-neutral-300">Datos Principales y Fiscales</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel htmlFor="type">Tipo de Cliente *</FormLabel>
                <Select id="type" name="type" value={formData.type} onChange={handleChange}>
                  <option value="particular">Particular</option>
                  <option value="autonomo">Autónomo</option>
                  <option value="empresa">Empresa</option>
                </Select>
              </div>

              <div>
                <FormLabel htmlFor="taxId">NIF / CIF / NIE *</FormLabel>
                <TextInput
                  type="text"
                  id="taxId"
                  name="taxId"
                  required
                  placeholder="Ej. 12345678Z / B12345678"
                  value={formData.taxId}
                  onChange={handleChange}
                  className="font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <FormLabel htmlFor="name">Nombre Completo / Razón Social *</FormLabel>
                <TextInput
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Ej. Manuel García Pérez / Talleres MotoSur S.L."
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <FormLabel htmlFor="phone">Teléfono de Contacto *</FormLabel>
                <TextInput
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  placeholder="Ej. 612 345 678"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <FormLabel htmlFor="email">Correo Electrónico</FormLabel>
                <TextInput
                  type="email"
                  id="email"
                  name="email"
                  placeholder="cliente@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: DIRECCIÓN POSTAL */}
          <div className="border-t border-neutral-800/80 pt-6">
            <h2 className="text-base font-bold uppercase tracking-wider text-orange-500 mb-4 flex items-center gap-2">
              <span>02</span>
              <span className="text-neutral-300">Dirección y Localización</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-4">
                <FormLabel htmlFor="streetType">Tipo de Vía</FormLabel>
                <Select id="streetType" name="streetType" value={formData.streetType} onChange={handleChange}>
                  <option value="calle">Calle</option>
                  <option value="avenida">Avenida</option>
                  <option value="plaza">Plaza</option>
                  <option value="pasaje">Pasaje</option>
                  <option value="camino">Camino</option>
                  <option value="paseo">Paseo</option>
                  <option value="carretera">Carretera</option>
                </Select>
              </div>

              <div className="sm:col-span-6">
                <FormLabel htmlFor="streetName">Nombre de la Vía</FormLabel>
                <TextInput
                  type="text"
                  id="streetName"
                  name="streetName"
                  placeholder="Ej. Mayor, Real, Constitución"
                  value={formData.streetName}
                  onChange={handleChange}
                />
              </div>

              <div className="sm:col-span-2">
                <FormLabel htmlFor="streetNumber">Nº / Puerta</FormLabel>
                <TextInput
                  type="text"
                  id="streetNumber"
                  name="streetNumber"
                  placeholder="Ej. 12 3ºB"
                  value={formData.streetNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="sm:col-span-4">
                <FormLabel htmlFor="city">Ciudad / Municipio</FormLabel>
                <TextInput
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Ej. Benalmádena"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="sm:col-span-3">
                <FormLabel htmlFor="province">Provincia</FormLabel>
                <TextInput
                  type="text"
                  id="province"
                  name="province"
                  placeholder="Ej. Málaga"
                  value={formData.province}
                  onChange={handleChange}
                />
              </div>

              <div className="sm:col-span-2">
                <FormLabel htmlFor="postalCode">C.P.</FormLabel>
                <TextInput
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  placeholder="Ej. 29630"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="font-mono"
                />
              </div>

              <div className="sm:col-span-3">
                <FormLabel htmlFor="country">País</FormLabel>
                <TextInput
                  type="text"
                  id="country"
                  name="country"
                  placeholder="España"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Mensaje de Error */}
          {error && <Alert variant="error">{error}</Alert>}

          {/* Botones de Acción */}
          <div className="pt-4 border-t border-neutral-800/80 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <Link
              to="/customers"
              className="w-full sm:w-auto text-center rounded-xl border border-neutral-700 bg-neutral-900 px-6 py-3 text-base font-bold text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              Cancelar
            </Link>

            <Button type="submit" isLoading={isLoading} loadingText="Registrando cliente...">
              Guardar cliente
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default CustomerCreate;