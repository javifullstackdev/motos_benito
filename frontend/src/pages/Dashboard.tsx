import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Panel de control</h1>
      <ul className="space-y-2">
        <li>
            <Link to="/customers" className="text-blue-600 underline">
            Ver clientes
            </Link>
        </li>
      
      <li>
        <Link to="/items" className="text-blue-600 underline">
          Ver artículos
        </Link>
      </li>
      <li>
        <Link to="/items/new" className="text-blue-600 underline">
          Crear artículo
        </Link>
      </li>
      <li>
        <Link to="/customers/new" className="text-blue-600 underline">
          Crear cliente
        </Link>
      </li>
      <li>
        <Link to="/invoices/new" className="text-blue-600 underline">
          Crear factura
        </Link>
      </li>
      </ul>
    </div>
  );
}

export default Dashboard;