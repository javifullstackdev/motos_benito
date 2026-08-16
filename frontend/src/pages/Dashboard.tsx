import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Panel de control</h1>
      <Link to="/customers" className="text-blue-600 underline">
        Ver clientes
      </Link>
      <Link to="/items" className="text-blue-600 underline">
        Ver artículos
      </Link>
      <Link to="/items/new" className="text-blue-600 underline">
        Crear artículo
      </Link>
      <Link to="/customers/new" className="text-blue-600 underline">
        Crear cliente
      </Link>
    </div>
  );
}

export default Dashboard;