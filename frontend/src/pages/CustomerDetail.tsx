import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiFetch from "../api/client";
import { normalizeInputValue } from "../utils/formatting";
import { isValidSpanishTaxId } from "../utils/taxId";
import ConfirmDialog from "../components/ConfirmDialog";
import Card from "../components/ui/Card";
import FormLabel from "../components/ui/FormLabel";
import TextInput from "../components/ui/TextInput";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

function CustomerDetail() {
  const { id } = useParams();
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
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsFetching(true);
    apiFetch(`/api/customers/${id}`)
      .then((data) => {
        if (data.customer) {
          setFormData(data.customer);
        }
      })
      .catch(() => setError("No se pudo cargar la ficha del cliente"))
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

    if (!isValidSpanishTaxId(formData.taxId)) {
      setError("El NIF/CIF/NIE no es válido");
      return;
    }

    setIsLoading(true);

    try {
      await apiFetch(`/api/customers/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      setSuccessMessage("Cambios guardados correctamente");
      setTimeout(() => {
        navigate("/customers");
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
      await apiFetch(`/api/customers/${id}`, { method: "DELETE" });
      navigate("/customers");
    } catch (err) {
      setError((err as Error).message);
      setIsConfirmOpen(false);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isFetching) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-neutral-400">
        <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent mb-3" />
        <p className="text-base uppercase tracking-wider">Cargando ficha del cliente...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-neutral-100">
      {/* Botón de retorno y migas */}
      <div className="mb-6">
        <Link
          to="/customers"
          className="inline-flex items-center gap-2 text-base font-semibold uppercase tracking-wider text-neutral-400 hover:text-orange-500 transition-colors"
        >
          <span>← Volver al directorio de clientes</span>
        </Link>
      </div>

      <Card className="p-6 sm:p-9">
        {/* Encabezado con información viva del cliente */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-950/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-500">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                Ficha de Cliente
              </span>
              <span className="rounded bg-neutral-950 px-2 py-0.5 font-mono text-base text-neutral-400 border border-neutral-800">
                ID #{id}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">
              {formData.name || "Detalle de Cliente"}
            </h1>
            <p className="text-base text-neutral-400 mt-1">
              Modifica la información de contacto o localización del titular
            </p>
          </div>

          {/* Accesos rápidos táctiles si existen datos de contacto */}
          <div className="flex flex-wrap items-center gap-2">
            {formData.phone && (
              <a
                href={`tel:${formData.phone}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-950/90 px-3 py-2 text-base font-semibold text-orange-400 hover:border-orange-500/50 hover:bg-neutral-900 transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Llamar</span>
              </a>
            )}
            {formData.email && (
              <a
                href={`mailto:${formData.email}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-950/90 px-3 py-2 text-base font-semibold text-neutral-300 hover:border-neutral-600 hover:bg-neutral-900 transition-colors"
              >
                <svg className="h-3.5 w-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email</span>
              </a>
            )}
          </div>
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

          {/* Feedback de Éxito */}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          {/* Feedback de Error */}
          {error && <Alert variant="error">{error}</Alert>}

          {/* Botones de Acción */}
          <div className="pt-4 border-t border-neutral-800/80 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <Link
              to="/customers"
              className="w-full sm:w-auto text-center rounded-xl border border-neutral-700 bg-neutral-900 px-6 py-3 text-base font-bold text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              Cancelar
            </Link>

            <Button type="submit" isLoading={isLoading} loadingText="Guardando cambios...">
              Guardar cambios
            </Button>

            <Button
              type="button"
              variant="danger"
              onClick={() => setIsConfirmOpen(true)}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar cliente"}
            </Button>
          </div>
        </form>
      </Card>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Eliminar cliente"
        message="¿Estás seguro de querer eliminar este cliente? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}

export default CustomerDetail;