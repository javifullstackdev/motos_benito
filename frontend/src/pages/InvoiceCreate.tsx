import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiFetch from "../api/client";
import { useAuth } from "../context/AuthContext";
import TypeToConfirmDialog from "../components/TypeToConfirmDialog";
import Card from "../components/ui/Card";
import FormLabel from "../components/ui/FormLabel";
import TextInput from "../components/ui/TextInput";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

type Workshop = {
  workshopId: number;
  name: string;
};

type Customer = {
  customerId: number;
  name: string;
};

type Item = {
  itemId: number;
  name: string;
  unitPrice: number;
};

type LineInput = {
  itemSearch: string;
  quantity: number;
};

function InvoiceCreate() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [workshopId, setWorkshopId] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [lines, setLines] = useState<LineInput[]>([{ itemSearch: "", quantity: 1 }]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState<{
    invoiceId: number;
    invoiceNumber: string;
  } | null>(null);

  const selectedCustomer = customers.find((customer) => customer.name === customerSearch);
  const { employee } = useAuth();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    apiFetch("/api/workshops")
      .then((data) => setWorkshops(data.workshops))
      .catch(() => setWorkshops([]));
    apiFetch("/api/customers")
      .then((data) => setCustomers(data.customers))
      .catch(() => setCustomers([]));
    apiFetch("/api/items")
      .then((data) => setItems(data.items))
      .catch(() => setItems([]));
  }, []);

  function updateLine(index: number, field: keyof LineInput, value: string | number) {
    setLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, [field]: value } : line))
    );
  }

  function addLine() {
    setLines((prev) => [...prev, { itemSearch: "", quantity: 1 }]);
  }

  function removeLine(index: number) {
    setLines((prev) => prev.filter((_, i) => i !== index));
  }

  // Cálculo en tiempo real del subtotal total provisional
  const invoiceSubtotal = lines.reduce((acc, line) => {
    const item = items.find((i) => i.name === line.itemSearch);
    return acc + (item ? item.unitPrice * (line.quantity || 0) : 0);
  }, 0);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!workshopId) {
      setError("Selecciona el taller emisor");
      return;
    }

    if (!selectedCustomer) {
      setError("Selecciona un cliente válido de la lista sugerida");
      return;
    }

    const resolvedLines = lines.map((line) => {
      const item = items.find((i) => i.name === line.itemSearch);
      return { itemId: item?.itemId, quantity: line.quantity };
    });

    if (resolvedLines.some((line) => !line.itemId)) {
      setError("Todas las líneas deben contener un artículo/servicio válido de la base de datos");
      return;
    }

    setIsConfirmOpen(true);
  }

  async function handleConfirmedCreate() {
    if (!selectedCustomer) {
      return;
    }

    const resolvedLines = lines.map((line) => {
      const item = items.find((i) => i.name === line.itemSearch);
      return { itemId: item?.itemId, quantity: line.quantity };
    });

    setIsLoading(true);

    try {
      const data = await apiFetch("/api/invoices", {
        method: "POST",
        body: JSON.stringify({
          workshopId: Number(workshopId),
          customerId: selectedCustomer.customerId,
          lines: resolvedLines,
        }),
      });
      setCreatedInvoice(data.invoice);
      setIsConfirmOpen(false);
    } catch (err) {
      setError((err as Error).message);
      setIsConfirmOpen(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-neutral-100">
      {/* Botón de retroceso */}
      <div className="mb-6">
        <Link
          to="/invoices"
          className="inline-flex items-center gap-2 text-base font-semibold uppercase tracking-wider text-neutral-400 hover:text-orange-500 transition-colors"
        >
          <span>← Volver al registro de facturas</span>
        </Link>
      </div>

      {/* Pantalla de Éxito / Factura Creada */}
      {createdInvoice ? (
        <Card accent="emerald" className="p-8 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-950/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
            Emisión Completada
          </span>
          <h2 className="text-2xl font-extrabold uppercase text-white tracking-tight">
            Factura {createdInvoice.invoiceNumber}
          </h2>
          <p className="mt-1 text-base text-neutral-400 max-w-md mx-auto">
            El documento se ha generado y registrado en la base de datos contable con código QR de verificación fiscal.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`/api/invoices/${createdInvoice.invoiceId}/pdf`}
              target="_blank"
              rel="noreferrer"
              download={`factura-${createdInvoice.invoiceNumber}.pdf`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-600/30 transition-all hover:bg-orange-500 active:scale-[0.99]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Descargar PDF Oficial</span>
            </a>

            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setCreatedInvoice(null);
                setCustomerSearch("");
                setLines([{ itemSearch: "", quantity: 1 }]);
              }}
            >
              Emitir otra factura
            </Button>
          </div>
        </Card>
      ) : (
        /* Formulario Principal de Creación */
        <Card className="p-6 sm:p-9">
          {/* Encabezado */}
          <div className="mb-8 border-b border-neutral-800 pb-5">
            <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">
              Emitir Nueva Factura
            </h1>
            <p className="text-base text-neutral-400 mt-1">
              Asigna taller, cliente receptor y desglose de intervenciones y recambios
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* SECCIÓN 1: DATOS CABECERA (TALLER Y CLIENTE) */}
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider text-orange-500 mb-4 flex items-center gap-2">
                <span>01</span>
                <span className="text-neutral-300">Emisor y Receptor</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel>Taller Emisor *</FormLabel>
                  <Select
                    value={workshopId}
                    onChange={(e) => setWorkshopId(e.target.value)}
                    required
                  >
                    <option value="">Selecciona un taller...</option>
                    {workshops.map((workshop) => (
                      <option key={workshop.workshopId} value={workshop.workshopId}>
                        {workshop.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <FormLabel>Cliente Receptor *</FormLabel>
                  <div className="relative">
                    <TextInput
                      list="customer-options"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      required
                      placeholder="Buscar por nombre de cliente..."
                    />
                    <datalist id="customer-options">
                      {customers.map((customer) => (
                        <option key={customer.customerId} value={customer.name} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: LÍNEAS DE DETALLE */}
            <div className="border-t border-neutral-800/80 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold uppercase tracking-wider text-orange-500 flex items-center gap-2">
                  <span>02</span>
                  <span className="text-neutral-300">Desglose de Conceptos</span>
                </h2>

                <button
                  type="button"
                  onClick={addLine}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-base font-bold text-neutral-200 transition-colors hover:border-orange-500 hover:text-orange-400"
                >
                  <span>+ Añadir concepto</span>
                </button>
              </div>

              {/* Contenedor de líneas dinámicas */}
              <div className="space-y-3">
                {lines.map((line, index) => {
                  const selectedItem = items.find((item) => item.name === line.itemSearch);
                  const subtotal = selectedItem ? selectedItem.unitPrice * (line.quantity || 0) : 0;

                  return (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-3.5 transition-colors hover:border-neutral-700"
                    >
                      {/* Buscador de artículo con datalist */}
                      <div className="flex-1 w-full">
                        <TextInput
                          list="item-options"
                          value={line.itemSearch}
                          onChange={(e) => updateLine(index, "itemSearch", e.target.value)}
                          placeholder="Buscar producto o servicio..."
                        />
                      </div>

                      {/* Cantidad */}
                      <div className="w-24 flex-shrink-0">
                        <TextInput
                          type="number"
                          value={line.quantity}
                          onChange={(e) => updateLine(index, "quantity", Number(e.target.value))}
                          min={1}
                          className="text-center font-mono"
                        />
                      </div>

                      {/* Precio Unitario / Subtotal dinámico */}
                      <div className="w-32 flex-shrink-0 text-right font-mono">
                        <span className="text-base font-bold text-orange-500 block">
                          {subtotal.toFixed(2)} €
                        </span>
                        <span className="text-sm text-neutral-500 block">
                          {selectedItem ? `${Number(selectedItem.unitPrice).toFixed(2)} €/u` : "—"}
                        </span>
                      </div>

                      {/* Botón Eliminar fila */}
                      <button
                        type="button"
                        onClick={() => removeLine(index)}
                        disabled={lines.length === 1}
                        aria-label="Quitar línea"
                        className="rounded-lg p-2 text-neutral-500 hover:bg-red-950/40 hover:text-red-400 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-500"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>

              <datalist id="item-options">
                {items.map((item) => (
                  <option key={item.itemId} value={item.name} />
                ))}
              </datalist>
            </div>

            {/* RESUMEN TOTAL ESTIMADO */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-4 flex items-center justify-between">
              <div>
                <span className="text-base font-bold uppercase tracking-wider text-neutral-400 block">
                  Total Estimado Factura
                </span>
                <span className="text-sm text-neutral-500">Impuestos y base desglosados en PDF</span>
              </div>
              <span className="text-xl font-extrabold font-mono text-orange-500">
                {invoiceSubtotal.toFixed(2)} €
              </span>
            </div>

            {/* Mensaje de Error */}
            {error && <Alert variant="error">{error}</Alert>}

            {/* Botones de Acción */}
            <div className="pt-4 border-t border-neutral-800/80 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <Link
                to="/invoices"
                className="w-full sm:w-auto text-center rounded-xl border border-neutral-700 bg-neutral-900 px-6 py-3 text-base font-bold text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                Cancelar
              </Link>

              <Button type="submit" isLoading={isLoading} loadingText="Generando factura...">
                Emitir factura y generar PDF
              </Button>
            </div>
          </form>
        </Card>
      )}

      <TypeToConfirmDialog
        isOpen={isConfirmOpen}
        title="Confirmar emisión de factura"
        message={`¿Estás seguro de que deseas generar la factura para "${selectedCustomer?.name}"? No podrás deshacer esta acción.`}
        inputLabel="Escribe tu DNI para confirmar"
        expectedValue={employee?.nationalId ?? ""}
        confirmLabel="Generar factura"
        isLoading={isLoading}
        onConfirm={handleConfirmedCreate}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}

export default InvoiceCreate;