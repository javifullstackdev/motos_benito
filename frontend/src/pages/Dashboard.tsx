import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiFetch from "../api/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
  const [revenueByMonth, setRevenueByMonth] = useState<
    { month: string; revenue: number }[]
  >([]);

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
    <div className="max-w-6xl mx-auto px-4 py-8 text-neutral-200">
      {/* Cabecera con acciones rápidas */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
            Panel de Control
          </h1>
          <p className="text-base text-neutral-400 mt-1">
            Resumen general de actividad y rendimiento del taller
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/invoices/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2.5 text-base font-semibold text-white shadow-lg shadow-orange-600/25 transition-all hover:bg-orange-500 active:scale-[0.99]"
          >
            <span>+ Nueva factura</span>
          </Link>
          <Link
            to="/customers/new"
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900/90 px-4 py-2.5 text-base font-semibold text-neutral-200 transition-all hover:border-neutral-600 hover:bg-neutral-800 hover:text-white"
          >
            <span>+ Nuevo cliente</span>
          </Link>
          <Link
            to="/items/new"
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900/90 px-4 py-2.5 text-base font-semibold text-neutral-200 transition-all hover:border-neutral-600 hover:bg-neutral-800 hover:text-white"
          >
            <span>+ Nuevo producto / servicio</span>
          </Link>
        </div>
      </div>

      {/* Gráfica de ingresos */}
      <div className="mb-8 rounded-2xl border border-neutral-800/90 bg-neutral-900/80 p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-wider uppercase text-white">
              Evolución de Ingresos
            </h2>
            <p className="text-base text-neutral-400 mt-0.5">
              Facturación acumulada mensual
            </p>
          </div>
          <span className="rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-[11px] font-medium text-neutral-300">
            Anual
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueByMonth}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#262626"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="#737373"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#404040" }}
              />
              <YAxis
                stroke="#737373"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#404040" }}
                tickFormatter={(val) => `${val}€`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#171717",
                  borderColor: "#262626",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "12px",
                }}
                itemStyle={{ color: "#ea580c" }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Ingresos"
                stroke="#ea580c"
                strokeWidth={2.5}
                dot={{ fill: "#ea580c", r: 4 }}
                activeDot={{
                  r: 6,
                  fill: "#ffffff",
                  stroke: "#ea580c",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid de 3 columnas para resúmenes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Últimas facturas */}
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-800/90 bg-neutral-900/80 p-6 shadow-xl backdrop-blur-xl">
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-sm font-bold tracking-wider uppercase text-white">
                Últimas Facturas
              </h2>
              <span className="text-[10px] uppercase font-semibold text-neutral-400">
                Recientes
              </span>
            </div>
            <ul className="space-y-3">
              {recentInvoices.map((invoice) => (
                <li
                  key={invoice.invoiceId}
                  className="flex items-center justify-between border-b border-neutral-800/60 pb-2.5 text-base"
                >
                  <div>
                    <span className="font-semibold text-white block">
                      {invoice.invoiceNumber}
                    </span>
                    <span className="text-neutral-400">
                      {invoice.customer.name}
                    </span>
                  </div>
                  <span className="font-bold text-orange-500">
                    {Number(invoice.total).toFixed(2)} €
                  </span>
                </li>
              ))}
              {recentInvoices.length === 0 && (
                <li className="py-4 text-center text-base text-neutral-500 italic">
                  Sin facturas registradas todavía
                </li>
              )}
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-800/50">
            <Link
              to="/invoices"
              className="text-base font-semibold text-orange-500 hover:text-orange-400 transition-colors"
            >
              Ver todas las facturas →
            </Link>
          </div>
        </div>

        {/* Últimos clientes */}
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-800/90 bg-neutral-900/80 p-6 shadow-xl backdrop-blur-xl">
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-sm font-bold tracking-wider uppercase text-white">
                Últimos Clientes
              </h2>
              <span className="text-[10px] uppercase font-semibold text-neutral-400">
                Nuevos
              </span>
            </div>
            <ul className="space-y-3">
              {recentCustomers.map((customer) => (
                <li
                  key={customer.customerId}
                  className="flex items-center justify-between border-b border-neutral-800/60 pb-2.5 text-base"
                >
                  <span className="font-medium text-neutral-200">
                    {customer.name}
                  </span>
                  <span className="rounded bg-neutral-800 px-2 py-0.5 text-sm font-medium text-neutral-400">
                    Registrado
                  </span>
                </li>
              ))}
              {recentCustomers.length === 0 && (
                <li className="py-4 text-center text-base text-neutral-500 italic">
                  Sin clientes registrados todavía
                </li>
              )}
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-800/50">
            <Link
              to="/customers"
              className="text-base font-semibold text-orange-500 hover:text-orange-400 transition-colors"
            >
              Ver directorio de clientes →
            </Link>
          </div>
        </div>

        {/* Productos/Servicios más vendidos */}
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-800/90 bg-neutral-900/80 p-6 shadow-xl backdrop-blur-xl">
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-sm font-bold tracking-wider uppercase text-white">
                Más Vendidos
              </h2>
              <span className="text-[10px] uppercase font-semibold text-neutral-400">
                Stock/Salidas
              </span>
            </div>
            <ul className="space-y-3">
              {topItems.map((item) => (
                <li
                  key={item.itemId}
                  className="flex items-center justify-between border-b border-neutral-800/60 pb-2.5 text-base"
                >
                  <span className="text-neutral-300">{item.name}</span>
                  <span className="rounded-md bg-neutral-800 px-2.5 py-1 text-base font-bold text-white">
                    {item.totalSold} uds.
                  </span>
                </li>
              ))}
              {topItems.length === 0 && (
                <li className="py-4 text-center text-base text-neutral-500 italic">
                  Sin ventas registradas todavía
                </li>
              )}
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-800/50">
            <Link
              to="/items"
              className="text-base font-semibold text-orange-500 hover:text-orange-400 transition-colors"
            >
              Gestionar inventario →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;