import { useEffect, useState } from "react";
import apiFetch from "../api/client";
import { Link } from "react-router-dom";

type Customer = {
    customerId: number;
    type: string;
    taxId: string;
    name: string;
    phone: string;
    email: string;
    streetType: string;
    streetName: string;
    streetNumber: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
};

function CustomerList() {

    const [customers, setCustomers] = useState<Customer[]>([]);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredCustomers = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.taxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        apiFetch("/api/customers")
        .then((data) => setCustomers(data.customers))
        .catch(() => setCustomers([]));
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Clientes</h1>
          <Link to="/customers/new" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Nuevo cliente</Link>
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm mb-4"
          />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-2">Nombre</th>
                  <th className="p-2">NIF/CIF</th>
                  <th className="p-2">Teléfono</th>
                  <th className="p-2">Email</th>
                </tr>
              </thead>
              <tbody>
              {filteredCustomers.map((customer) => (
                  <tr key={customer.customerId} className="border-b">
                    <td className="p-2">
                      <Link to={`/customers/${customer.customerId}`} className="text-blue-600 hover:underline">
                        {customer.name}
                      </Link>
                    </td>
                    <td className="p-2">{customer.taxId}</td>
                    <td className="p-2">{customer.phone}</td>
                    <td className="p-2">{customer.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    );
}

export default CustomerList;