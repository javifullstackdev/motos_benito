import { useEffect, useState } from "react";
import apiFetch from "./api/client";

function App() {
  const [status, setStatus] = useState("cargando...");

  useEffect(() => {
    apiFetch("/api/health")
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("error de conexión"));
  }, []);

  return (
    <h1 className="text-3xl font-bold text-blue-600">
      Estado del backend: {status}
    </h1>
  );
}

export default App;
