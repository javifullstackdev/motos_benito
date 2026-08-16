import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Panel de control</h1>
      <Link to="/customers" className="text-blue-600 underline">
        Ver clientes
      </Link>
    </div>
  );
}

export default Dashboard;