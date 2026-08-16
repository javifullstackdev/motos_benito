import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../api/client";

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
  const navigate = useNavigate();

  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [workshopId, setWorkshopId] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [lines, setLines] = useState<LineInput[]>([{ itemSearch: "", quantity: 1 }]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState<{ invoiceId: number; invoiceNumber: string } | null>(null);

  const selectedCustomer = customers.find((customer) => customer.name === customerSearch);

  

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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
  
    if (!selectedCustomer) {
      setError("Selecciona un cliente válido de la lista");
      return;
    }
  
    const resolvedLines = lines.map((line) => {
      const item = items.find((i) => i.name === line.itemSearch);
      return { itemId: item?.itemId, quantity: line.quantity };
    });
  
    if (resolvedLines.some((line) => !line.itemId)) {
      setError("Todas las líneas deben tener un artículo válido de la lista");
      return;
    }
  
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
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Nueva factura</h1>
  
      {createdInvoice ? (
        <div>
          <p className="mb-2">Factura {createdInvoice.invoiceNumber} creada correctamente.</p>
          <a
            href={`${import.meta.env.VITE_API_URL}/api/invoices/${createdInvoice.invoiceId}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            Descargar PDF
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <select value={workshopId} onChange={(e) => setWorkshopId(e.target.value)}>
            <option value="">Selecciona un taller</option>
            {workshops.map((workshop) => (
              <option key={workshop.workshopId} value={workshop.workshopId}>
                {workshop.name}
              </option>
            ))}
          </select>
  
          <input
            list="customer-options"
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            placeholder="Buscar cliente por nombre"
          />
          <datalist id="customer-options">
            {customers.map((customer) => (
              <option key={customer.customerId} value={customer.name} />
            ))}
          </datalist>
  
          {lines.map((line, index) => {
            const selectedItem = items.find((item) => item.name === line.itemSearch);
  
            return (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  list="item-options"
                  value={line.itemSearch}
                  onChange={(e) => updateLine(index, "itemSearch", e.target.value)}
                  placeholder="Buscar artículo"
                />
                <input
                  type="number"
                  value={line.quantity}
                  onChange={(e) => updateLine(index, "quantity", Number(e.target.value))}
                  min={1}
                />
                {selectedItem && <span>{selectedItem.unitPrice} €</span>}
                <button type="button" onClick={() => removeLine(index)}>Quitar</button>
              </div>
            );
          })}
  
          <datalist id="item-options">
            {items.map((item) => (
              <option key={item.itemId} value={item.name} />
            ))}
          </datalist>
  
          <button type="button" onClick={addLine}>Añadir línea</button>
  
          <div className="mt-4">
            <button type="submit" disabled={isLoading} className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
              {isLoading ? "Creando..." : "Crear factura"}
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </form>
      )}
    </div>
  );
}

export default InvoiceCreate;