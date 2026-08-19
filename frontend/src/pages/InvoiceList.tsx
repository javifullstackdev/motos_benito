import { useEffect, useState } from "react";
import apiFetch from "../api/client";
import { Link } from "react-router-dom";

type Invoice = {
  invoiceId: number;
  invoiceNumber: string;
  issueDate: string;
  total: number;
  customer: { customerId: number; name: string };
  workshop: { workshopId: number; name: string };
  employee: { emplId: number; firstName: string; lastName1: string };
};

function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.workshop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.employee.lastName1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.issueDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.total.toString().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    apiFetch("/api/invoices")
      .then((data) => setInvoices(data.invoices))
      .catch(() => setInvoices([]));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-neutral-200">
      {/* Cabecera con título, métrica y acción */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
            Registro de Facturas
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Histórico contable, facturación por cliente y exportación de documentos
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="rounded-full border border-neutral-800 bg-neutral-900/90 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-neutral-400">
            Total emitidas: <strong className="text-white">{filteredInvoices.length}</strong>
          </span>
          <Link
            to="/invoices/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-600/25 transition-all hover:bg-orange-500 active:scale-[0.99]"
          >
            <span>+ Nueva factura</span>
          </Link>
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-6 rounded-xl border border-neutral-800/90 bg-neutral-900/80 p-3 sm:p-4 shadow-xl backdrop-blur-xl">
        <div className="relative w-full">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar por nº factura, cliente, taller, mecánico o fecha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950/90 py-2.5 sm:py-3 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-neutral-500 transition-all focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. VISTA MOBILE: TARJETAS COMPACTAS (< MD)                */}
      {/* ========================================================= */}
      <div className="flex flex-col gap-3.5 md:hidden">
        {filteredInvoices.map((invoice) => (
          <div
            key={invoice.invoiceId}
            className="rounded-2xl border border-neutral-800/90 bg-neutral-900/85 p-4 shadow-lg backdrop-blur-md"
          >
            {/* Fila superior: Nº Factura + Importe en 2 líneas protegidas */}
            <div className="flex items-start justify-between gap-3 border-b border-neutral-800/70 pb-3">
              <div>
                <span className="inline-block font-mono text-xs font-bold text-white rounded-lg bg-neutral-950 px-2.5 py-1 border border-neutral-800">
                  {invoice.invoiceNumber}
                </span>
                <span className="block mt-1 text-[11px] font-mono text-neutral-500">
                  {invoice.issueDate}
                </span>
              </div>

              {/* Total en 2 líneas */}
              <div className="flex-shrink-0 text-right whitespace-nowrap rounded-xl bg-neutral-950/90 border border-neutral-800 px-3 py-1.5">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Total
                </span>
                <span className="block font-mono text-base font-extrabold text-orange-500">
                  {Number(invoice.total).toFixed(2)} €
                </span>
              </div>
            </div>

            {/* Datos del receptor y emisor */}
            <div className="py-3 flex flex-col gap-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Cliente:</span>
                <span className="font-bold text-white text-right truncate max-w-[210px]">
                  {invoice.customer.name}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">Taller / Emisor:</span>
                <span className="text-neutral-300 truncate max-w-[210px]">
                  {invoice.workshop.name}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">Mecánico resp.:</span>
                <span className="text-neutral-400 truncate max-w-[210px]">
                  {invoice.employee.firstName} {invoice.employee.lastName1}
                </span>
              </div>
            </div>

            {/* Acción de descarga directa en mobile */}
            <div className="pt-2 border-t border-neutral-800/70">
              <a
                href={`${import.meta.env.VITE_API_URL || ""}/api/invoices/${invoice.invoiceId}/pdf`}
                target="_blank"
                rel="noreferrer"
                download={`factura-${invoice.invoiceNumber}.pdf`}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-800/90 border border-neutral-700 py-2.5 text-xs font-bold text-neutral-200 transition-colors hover:border-orange-500 hover:text-orange-400"
              >
                <svg className="h-4 w-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Descargar Factura en PDF</span>
              </a>
            </div>
          </div>
        ))}

        {filteredInvoices.length === 0 && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-8 text-center text-xs text-neutral-400 italic">
            No se encontraron facturas registradas con ese criterio.
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. VISTA DESKTOP: TABLA TRADICIONAL (MD+)                 */}
      {/* ========================================================= */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-neutral-800/90 bg-neutral-900/80 shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60 text-xs font-bold uppercase tracking-wider text-neutral-400">
                <th className="px-5 py-4">Nº Factura</th>
                <th className="px-5 py-4">Cliente</th>
                <th className="px-5 py-4">Taller / Empleado</th>
                <th className="px-5 py-4">Fecha Emisión</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4 text-right">Documento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-sm">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.invoiceId} className="transition-colors hover:bg-neutral-800/40">
                  <td className="px-5 py-4">
                    <span className="font-mono font-semibold text-white rounded bg-neutral-950/80 px-2.5 py-1 border border-neutral-800 text-xs">
                      {invoice.invoiceNumber}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-medium text-white">
                    {invoice.customer.name}
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-neutral-300 block">{invoice.workshop.name}</span>
                    <span className="text-xs text-neutral-500">
                      Resp: {invoice.employee.firstName} {invoice.employee.lastName1}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-mono text-xs text-neutral-400">
                    {invoice.issueDate}
                  </td>

                  <td className="px-5 py-4 font-mono font-bold text-orange-500">
                    {Number(invoice.total).toFixed(2)} €
                  </td>

                  <td className="px-5 py-4 text-right">
                    <a
                      href={`${import.meta.env.VITE_API_URL || ""}/api/invoices/${invoice.invoiceId}/pdf`}
                      target="_blank"
                      rel="noreferrer"
                      download={`factura-${invoice.invoiceNumber}.pdf`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800/80 px-3 py-1.5 text-xs font-semibold text-neutral-200 transition-colors hover:border-orange-500 hover:text-orange-400"
                    >
                      <svg className="h-3.5 w-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      PDF
                    </a>
                  </td>
                </tr>
              ))}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-neutral-500 italic">
                    No se encontraron facturas con el criterio de búsqueda.
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

export default InvoiceList;