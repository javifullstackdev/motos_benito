import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomerList from "./pages/CustomerList";
import CustomerCreate from "./pages/CustomerCreate";
import ItemList from "./pages/ItemList";
import ItemCreate from "./pages/ItemCreate";
import InvoiceCreate from "./pages/InvoiceCreate";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><CustomerList /></ProtectedRoute>} />
          <Route path="/customers/new" element={<ProtectedRoute><CustomerCreate /></ProtectedRoute>} />
          <Route path="/items" element={<ProtectedRoute><ItemList /></ProtectedRoute>} />
          <Route path="/items/new" element={<ProtectedRoute><ItemCreate /></ProtectedRoute>} />
          <Route path="/invoices/new" element={<ProtectedRoute><InvoiceCreate /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
