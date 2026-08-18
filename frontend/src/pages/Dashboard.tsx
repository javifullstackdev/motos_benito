import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiFetch from "../api/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type Invoice = {
  invoiceId: number;
  invoiceNumber: string;
  total: number;
  customer: { name: string };
};

type Customer = {
  customerId: number;
  name: string;
};

type TopItem = {
  itemId: number;
  name: string;
  totalSold: number;
};

function Dashboard() {
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([]);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [revenueByMonth, setRevenueByMonth] = useState<{ month: string; revenue: number }[]>([]);

  useEffect(() => {
    apiFetch("/api/invoices")
      .then((data) => setRecentInvoices(data.invoices.slice(0, 5)))
      .catch(() => setRecentInvoices([]));
    apiFetch("/api/customers")
      .then((data) => setRecentCustomers(data.customers.slice(0, 5)))
      .catch(() => setRecentCustomers([]));
    apiFetch("/api/stats/top-items")
      .then((data) => setTopItems(data.topItems))
      .catch(() => setTopItems([]));
    apiFetch("/api/stats/revenue-by-month")
      .then((data) => setRevenueByMonth(data.revenueByMonth))
      .catch(() => setRevenueByMonth([]));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">Panel de control</h1>
      <p className="text-gray-500 mb-6">Resumen de la actividad del taller</p>

      <div className="flex flex-wrap gap-3 mb-8">
        <Link to="/invoices/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          Nueva factura
        </Link>
        <Link to="/customers/new" className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
          Nuevo cliente
        </Link>
        <Link to="/items/new" className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
          Nuevo artículo
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Últimas facturas</h2>
          <ul className="space-y-2">
            {recentInvoices.map((invoice) => (
              <li key={invoice.invoiceId} className="flex justify-between text-sm">
                <span className="text-gray-600">{invoice.invoiceNumber} · {invoice.customer.name}</span>
                <span className="font-medium">{invoice.total} €</span>
              </li>
            ))}
            {recentInvoices.length === 0 && <li className="text-sm text-gray-400">Sin facturas todavía</li>}
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Últimos clientes</h2>
          <ul className="space-y-2">
            {recentCustomers.map((customer) => (
              <li key={customer.customerId} className="text-sm text-gray-600">
                {customer.name}
              </li>
            ))}
            {recentCustomers.length === 0 && <li className="text-sm text-gray-400">Sin clientes todavía</li>}
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Artículos más vendidos</h2>
          <ul className="space-y-2">
            {topItems.map((item) => (
              <li key={item.itemId} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name}</span>
                <span className="font-medium">{item.totalSold} uds.</span>
              </li>
            ))}
            {topItems.length === 0 && <li className="text-sm text-gray-400">Sin ventas todavía</li>}
          </ul>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 mt-6">
        <h2 className="font-semibold text-gray-900 mb-3">Ingresos por mes</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={revenueByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;