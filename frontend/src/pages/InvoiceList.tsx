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

    const filteredInvoices = invoices.filter((invoice) =>
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
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Facturas</h1>
          <input
            type="text"
            placeholder="Buscar facturas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm mb-4"
          />
          <Link to="/invoices/new" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Nueva factura</Link>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                <tr className="border-b text-left">
                    <th className="p-2">Número de factura</th>
                    <th className="p-2">Cliente</th>
                    <th className="p-2">Taller</th>
                    <th className="p-2">Empleado</th>
                    <th className="p-2">Fecha de emisión</th>
                    <th className="p-2">Total</th>
                    <th className="p-2">Descargar</th>
                </tr>
                </thead>
                <tbody>
                {filteredInvoices.map((invoice) => (
                    <tr key={invoice.invoiceId} className="border-b">
                    <td className="p-2">{invoice.invoiceNumber}</td>
                    <td className="p-2">{invoice.customer.name}</td>
                    <td className="p-2">{invoice.workshop.name}</td>
                    <td className="p-2">{invoice.employee.firstName} {invoice.employee.lastName1}</td>
                    <td className="p-2">{invoice.issueDate}</td>
                    <td className="p-2">{invoice.total}</td>
                    <td className="p-2">
                        <a
                            href={`${import.meta.env.VITE_API_URL}/api/invoices/${invoice.invoiceId}/pdf`}
                            target="_blank"
                            rel="noreferrer"
                            download={`factura-${invoice.invoiceNumber}.pdf`}
                            className="text-blue-500 hover:text-blue-700"
                            >
                                Descargar
                        </a>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
    );
}

export default InvoiceList;